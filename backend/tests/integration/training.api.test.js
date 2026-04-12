/**
 * Integration tests: enrollments API (loaded via suite.test.js).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../app.js";
import Course from "../../models/Course.js";
import { createUser, authHeader } from "./auth-helpers.js";

async function seedActiveCourse(overrides = {}) {
  const teacher = await createUser({ role: "teacher" });
  const course = await Course.create({
    title: "Training Course Alpha",
    description: "A full description for the integration test course module.",
    category: "General",
    level: "Beginner",
    duration: 10,
    status: "Active",
    createdBy: teacher._id,
    ...overrides,
  });
  return { course, teacher };
}

test("POST /api/enrollments — 201 and enrollment on success", async () => {
  const student = await createUser({ role: "student" });
  const { course } = await seedActiveCourse();

  const res = await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data);
  assert.equal(res.body.data.courseId.toString(), course._id.toString());
  assert.equal(res.body.data.studentId.toString(), student._id.toString());
});

test("POST /api/enrollments — 400 when already enrolled", async () => {
  const student = await createUser({ role: "student" });
  const { course } = await seedActiveCourse();

  await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  const res = await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /already enrolled/i);
});

test("POST /api/enrollments — 404 when course does not exist", async () => {
  const student = await createUser({ role: "student" });
  const missingId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: missingId.toString() });

  assert.equal(res.status, 404);
});

test("POST /api/enrollments — 400 when course is not active", async () => {
  const student = await createUser({ role: "student" });
  const { course } = await seedActiveCourse({ status: "Inactive" });

  const res = await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /inactive/i);
});

test("PATCH /api/enrollments/:id/progress — 200 success and 400 for out-of-range", async () => {
  const student = await createUser({ role: "student" });
  const { course } = await seedActiveCourse();

  const enrollRes = await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  const enrollmentId = enrollRes.body.data._id;

  const badLow = await request(app)
    .patch(`/api/enrollments/${enrollmentId}/progress`)
    .set(authHeader(student))
    .send({ progressPercentage: -1 });
  assert.equal(badLow.status, 400);

  const badHigh = await request(app)
    .patch(`/api/enrollments/${enrollmentId}/progress`)
    .set(authHeader(student))
    .send({ progressPercentage: 101 });
  assert.equal(badHigh.status, 400);

  const ok = await request(app)
    .patch(`/api/enrollments/${enrollmentId}/progress`)
    .set(authHeader(student))
    .send({ progressPercentage: 50 });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.data.progressPercentage, 50);
});

test("PATCH /api/enrollments/:id/progress — auto-complete at 100", async () => {
  const student = await createUser({ role: "student" });
  const { course } = await seedActiveCourse();

  const enrollRes = await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  const enrollmentId = enrollRes.body.data._id;

  const res = await request(app)
    .patch(`/api/enrollments/${enrollmentId}/progress`)
    .set(authHeader(student))
    .send({ progressPercentage: 100 });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.completionStatus, "Completed");
  assert.ok(res.body.data.completedAt);
});

test("GET /api/enrollments/student/:studentId — lists enrollments with course details", async () => {
  const student = await createUser({ role: "student" });
  const { course } = await seedActiveCourse();

  await request(app)
    .post("/api/enrollments")
    .set(authHeader(student))
    .send({ courseId: course._id.toString() });

  const res = await request(app)
    .get(`/api/enrollments/student/${student._id.toString()}`)
    .set(authHeader(student));

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 1);
  assert.ok(res.body[0].course);
  assert.equal(res.body[0].course.title, course.title);
});
