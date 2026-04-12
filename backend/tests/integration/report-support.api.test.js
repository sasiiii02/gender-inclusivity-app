/**
 * Uses real JWT auth (via suite.test.js JWT_SECRET).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../app.js";
import CaseStatus from "../../models/CaseStatus.js";
import ReportCategory from "../../models/ReportCategory.js";
import ReportStatusHistory from "../../models/ReportStatusHistory.js";
import SupportArticle from "../../models/SupportArticle.js";
import { createUser, authHeader } from "./auth-helpers.js";
import { clearAllCollections } from "./memory-db.js";

async function seedPendingAndCategory(admin) {
  const pending = await CaseStatus.create({ name: "Pending" });
  const inReview = await CaseStatus.create({ name: "In Review" });
  const category = await ReportCategory.create({ name: "Safety" });
  return { pending, inReview, category, admin };
}

test("POST /api/reports — 201; Pending status; anonymous clears reportedBy", async () => {
  const admin = await createUser({ role: "admin" });
  const { category } = await seedPendingAndCategory(admin);
  const student = await createUser({ role: "student" });

  const authenticated = await request(app)
    .post("/api/reports")
    .set(authHeader(student))
    .send({
      title: "Campus incident report",
      description: "Detailed description of the incident for the record.",
      categoryId: category._id.toString(),
      isAnonymous: false,
      priority: "Medium",
    });

  assert.equal(authenticated.status, 201);
  const reportedBy = authenticated.body.report.reportedBy;
  assert.ok(reportedBy);
  assert.equal(String(reportedBy._id ?? reportedBy), student._id.toString());

  const anon = await request(app)
    .post("/api/reports")
    .set(authHeader(student))
    .send({
      title: "Anonymous concern submission",
      description: "Another detailed description for anonymous reporting flow.",
      categoryId: category._id.toString(),
      isAnonymous: true,
      priority: "Low",
    });

  assert.equal(anon.status, 201);
  assert.equal(anon.body.report.reportedBy, null);
  assert.equal(anon.body.report.isAnonymous, true);
});

test("POST /api/reports — fails when Pending status not seeded", async () => {
  const student = await createUser({ role: "student" });
  const category = await ReportCategory.create({ name: "X" });

  const res = await request(app)
    .post("/api/reports")
    .set(authHeader(student))
    .send({
      title: "No pending status",
      description: "Description long enough for the report body validation.",
      categoryId: category._id.toString(),
    });

  assert.equal(res.status, 500);
  assert.match(res.body.message, /default status not found/i);
});

test("PATCH /api/reports/:id/status — admin 404 / 400 closed / success + history", async () => {
  const admin = await createUser({ role: "admin" });
  const { category, inReview } = await seedPendingAndCategory(admin);
  const student = await createUser({ role: "student" });

  const created = await request(app)
    .post("/api/reports")
    .set(authHeader(student))
    .send({
      title: "Status workflow report",
      description: "Long description for report creation in integration test.",
      categoryId: category._id.toString(),
    });

  const reportId = created.body.report._id;

  const missing = await request(app)
    .patch(`/api/reports/${new mongoose.Types.ObjectId().toString()}/status`)
    .set(authHeader(admin))
    .send({ statusId: inReview._id.toString() });

  assert.equal(missing.status, 404);

  await request(app)
    .patch(`/api/reports/${reportId}/close`)
    .set(authHeader(admin));

  const closedPatch = await request(app)
    .patch(`/api/reports/${reportId}/status`)
    .set(authHeader(admin))
    .send({ statusId: inReview._id.toString() });

  assert.equal(closedPatch.status, 400);
  assert.match(closedPatch.body.message, /closed/i);

  await clearAllCollections();
  const admin2 = await createUser({ role: "admin" });
  const seeded = await seedPendingAndCategory(admin2);
  const student2 = await createUser({ role: "student" });

  const openReport = await request(app)
    .post("/api/reports")
    .set(authHeader(student2))
    .send({
      title: "Open report for status",
      description: "Description for open report used in status update test.",
      categoryId: seeded.category._id.toString(),
    });

  const openId = openReport.body.report._id;

  const beforeHist = await ReportStatusHistory.countDocuments({
    reportId: openId,
  });
  assert.equal(beforeHist, 0);

  const ok = await request(app)
    .patch(`/api/reports/${openId}/status`)
    .set(authHeader(admin2))
    .send({ statusId: seeded.inReview._id.toString() });

  assert.equal(ok.status, 200);
  const afterHist = await ReportStatusHistory.countDocuments({
    reportId: openId,
  });
  assert.equal(afterHist, 1);
});

test("GET /api/reports/:id/responses — 403 for non-owner non-admin", async () => {
  const admin = await createUser({ role: "admin" });
  const { category } = await seedPendingAndCategory(admin);
  const owner = await createUser({ role: "student" });
  const other = await createUser({ role: "student" });

  const created = await request(app)
    .post("/api/reports")
    .set(authHeader(owner))
    .send({
      title: "Owner only responses",
      description: "Description for response authorization integration test.",
      categoryId: category._id.toString(),
    });

  const reportId = created.body.report._id;

  const res = await request(app)
    .get(`/api/reports/${reportId}/responses`)
    .set(authHeader(other));

  assert.equal(res.status, 403);
});

test("GET /api/support-articles/:id — 404 and view increment", async () => {
  const admin = await createUser({ role: "admin" });

  const missing = await request(app).get(
    `/api/support-articles/${new mongoose.Types.ObjectId().toString()}`,
  );
  assert.equal(missing.status, 404);

  const article = await SupportArticle.create({
    title: "How to reset password",
    content: "Step by step instructions for password reset flow.",
    category: "Account",
    createdBy: admin._id,
    isPublished: true,
    views: 0,
  });

  const first = await request(app).get(
    `/api/support-articles/${article._id.toString()}`,
  );
  assert.equal(first.status, 200);
  assert.equal(first.body.views, 1);

  const second = await request(app).get(
    `/api/support-articles/${article._id.toString()}`,
  );
  assert.equal(second.status, 200);
  assert.equal(second.body.views, 2);
});

test("GET /api/support-articles — category filter, published only", async () => {
  const admin = await createUser({ role: "admin" });

  await SupportArticle.create({
    title: "Published FAQ Item One",
    content: "Content for published FAQ.",
    category: "FAQ",
    createdBy: admin._id,
    isPublished: true,
  });

  await SupportArticle.create({
    title: "Draft internal note",
    content: "Should not appear in public list.",
    category: "FAQ",
    createdBy: admin._id,
    isPublished: false,
  });

  const res = await request(app).get("/api/support-articles").query({
    category: "FAQ",
  });

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0].title, "Published FAQ Item One");
});
