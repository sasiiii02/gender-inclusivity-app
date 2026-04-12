import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../../app.js";
import ECampaign from "../../models/ECampaign.js";
import EEvent from "../../models/EEvent.js";
import { createUser, authHeader } from "./auth-helpers.js";

function futureIso(daysAhead = 7) {
  return new Date(Date.now() + daysAhead * 86400000).toISOString();
}

async function seedCampaign(admin) {
  return ECampaign.create({
    title: "Gender Equity Campaign 2026",
    description: "A detailed campaign description for integration testing purposes.",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
    status: "Active",
    createdBy: admin._id,
  });
}

function validEventPayload(campaignId) {
  return {
    campaignId: campaignId.toString(),
    title: "Inclusive Workshop Series",
    eventType: "Workshop",
    eventDate: futureIso(14),
    location: "Main Auditorium",
    capacity: 50,
    speaker: "Dr. Example",
  };
}

test("POST /api/events — 201 with event data", async () => {
  const admin = await createUser({ role: "admin" });
  const teacher = await createUser({ role: "teacher" });
  const campaign = await seedCampaign(admin);

  const res = await request(app)
    .post("/api/events")
    .set(authHeader(teacher))
    .send(validEventPayload(campaign._id));

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data);
  assert.equal(res.body.data.title, "Inclusive Workshop Series");
});

test("POST /api/events — 400 when title and eventType missing (validation)", async () => {
  const admin = await createUser({ role: "admin" });
  const teacher = await createUser({ role: "teacher" });
  const campaign = await seedCampaign(admin);

  const res = await request(app)
    .post("/api/events")
    .set(authHeader(teacher))
    .send({
      campaignId: campaign._id.toString(),
      eventDate: futureIso(10),
      location: "Hall",
      capacity: 20,
      speaker: "Speaker",
    });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(Array.isArray(res.body.errors));
});

test("GET /api/events — pagination and campaignId filter; soft-deleted excluded", async () => {
  const admin = await createUser({ role: "admin" });
  const teacher = await createUser({ role: "teacher" });
  const campaign = await seedCampaign(admin);

  const payload = validEventPayload(campaign._id);
  await request(app).post("/api/events").set(authHeader(teacher)).send(payload);

  const deleted = await EEvent.create({
    ...payload,
    title: "Deleted Event Title Here",
    campaignId: campaign._id,
    createdBy: teacher._id,
    isDeleted: true,
  });
  assert.ok(deleted._id);

  const res = await request(app).get("/api/events").query({
    campaignId: campaign._id.toString(),
    page: 1,
    limit: 10,
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const events = res.body.data.events;
  assert.ok(Array.isArray(events));
  assert.ok(events.every((e) => e.isDeleted !== true));
  assert.ok(events.some((e) => e.title === "Inclusive Workshop Series"));
});

test("DELETE /api/events/:id — soft delete returns 200 and isDeleted true", async () => {
  const admin = await createUser({ role: "admin" });
  const teacher = await createUser({ role: "teacher" });
  const campaign = await seedCampaign(admin);

  const created = await request(app)
    .post("/api/events")
    .set(authHeader(teacher))
    .send(validEventPayload(campaign._id));

  const eventId = created.body.data._id;

  const res = await request(app)
    .delete(`/api/events/${eventId}`)
    .set(authHeader(admin));

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.isDeleted, true);
});

test("GET /api/campaigns — search on title (case-insensitive)", async () => {
  const admin = await createUser({ role: "admin" });
  await ECampaign.create({
    title: "Unique Rainbow Awareness Title",
    description: "Another long description for campaign schema validation.",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-06-01"),
    createdBy: admin._id,
  });

  const res = await request(app).get("/api/campaigns").query({
    search: "rainbow",
    page: 1,
    limit: 10,
  });

  assert.equal(res.status, 200);
  const { campaigns } = res.body.data;
  assert.ok(campaigns.length >= 1);
  assert.ok(
    campaigns.some((c) => /rainbow/i.test(c.title)),
  );
});

test("PATCH /api/campaigns/:id/archive — sets status Archived", async () => {
  const admin = await createUser({ role: "admin" });
  const campaign = await seedCampaign(admin);

  const res = await request(app)
    .patch(`/api/campaigns/${campaign._id.toString()}/archive`)
    .set(authHeader(admin));

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.status, "Archived");
});
