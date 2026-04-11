import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../app.js";
import QMQuizSession from "../../models/QM-QuizSession.js";
import { createUser, authHeader } from "./auth-helpers.js";

function quizPayload() {
  return {
    title: "Integration Quiz Beta",
    description: "Quiz for API integration testing.",
    subject: "Science",
    grade: "10",
    passcode: "quiz",
    duration: 30,
    passMarks: 40,
  };
}

const sampleQuestion = {
  questionText: "What is 2+2?",
  questionType: "mcq",
  options: [
    { text: "3", isCorrect: false },
    { text: "4", isCorrect: true },
  ],
  marks: 5,
  orderIndex: 0,
};

test("POST /api/quizzes — creates draft quiz", async () => {
  const teacher = await createUser({ role: "teacher" });

  const res = await request(app)
    .post("/api/quizzes")
    .set(authHeader(teacher))
    .send(quizPayload());

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.status, "draft");
});

test("PUT /api/quizzes/:id/publish — 400 with zero questions", async () => {
  const teacher = await createUser({ role: "teacher" });

  const createRes = await request(app)
    .post("/api/quizzes")
    .set(authHeader(teacher))
    .send(quizPayload());

  const quizId = createRes.body.data._id;

  const res = await request(app)
    .put(`/api/quizzes/${quizId}/publish`)
    .set(authHeader(teacher));

  assert.equal(res.status, 400);
  assert.match(res.body.message, /no questions/i);
});

test("PUT /api/quizzes/:id/publish — success sets published and totals", async () => {
  const teacher = await createUser({ role: "teacher" });

  const createRes = await request(app)
    .post("/api/quizzes")
    .set(authHeader(teacher))
    .send(quizPayload());
  const quizId = createRes.body.data._id;

  await request(app)
    .post(`/api/quizzes/${quizId}/questions`)
    .set(authHeader(teacher))
    .send(sampleQuestion);

  await request(app)
    .post(`/api/quizzes/${quizId}/questions`)
    .set(authHeader(teacher))
    .    send({
      ...sampleQuestion,
      questionText: "Second question?",
      marks: 3,
      orderIndex: 1,
    });

  const pub = await request(app)
    .put(`/api/quizzes/${quizId}/publish`)
    .set(authHeader(teacher));

  assert.equal(pub.status, 200);
  assert.equal(pub.body.data.status, "published");
  assert.equal(pub.body.data.totalMarks, 8);
  assert.equal(pub.body.data.totalQuestions, 2);
});

test("GET /api/quizzes/:id — includes questions; 404 when missing", async () => {
  const teacher = await createUser({ role: "teacher" });

  const createRes = await request(app)
    .post("/api/quizzes")
    .set(authHeader(teacher))
    .send(quizPayload());
  const quizId = createRes.body.data._id;

  await request(app)
    .post(`/api/quizzes/${quizId}/questions`)
    .set(authHeader(teacher))
    .send(sampleQuestion);

  const res = await request(app)
    .get(`/api/quizzes/${quizId}`)
    .set(authHeader(teacher));

  assert.equal(res.status, 200);
  assert.ok(res.body.data.questions);
  assert.equal(res.body.data.questions.length, 1);

  const missing = new mongoose.Types.ObjectId();
  const notFound = await request(app)
    .get(`/api/quizzes/${missing.toString()}`)
    .set(authHeader(teacher));

  assert.equal(notFound.status, 404);
});

test("POST /api/quizzes/:id/start-session — 400 if not published", async () => {
  const teacher = await createUser({ role: "teacher" });

  const createRes = await request(app)
    .post("/api/quizzes")
    .set(authHeader(teacher))
    .send(quizPayload());
  const quizId = createRes.body.data._id;

  await request(app)
    .post(`/api/quizzes/${quizId}/questions`)
    .set(authHeader(teacher))
    .send(sampleQuestion);

  const res = await request(app)
    .post(`/api/quizzes/${quizId}/start-session`)
    .set(authHeader(teacher));

  assert.equal(res.status, 400);
  assert.match(res.body.message, /published/i);
});

test("POST /api/quizzes/:id/start-session — success creates session", async () => {
  const teacher = await createUser({ role: "teacher" });

  const createRes = await request(app)
    .post("/api/quizzes")
    .set(authHeader(teacher))
    .send(quizPayload());
  const quizId = createRes.body.data._id;

  await request(app)
    .post(`/api/quizzes/${quizId}/questions`)
    .set(authHeader(teacher))
    .send(sampleQuestion);

  await request(app)
    .put(`/api/quizzes/${quizId}/publish`)
    .set(authHeader(teacher));

  const res = await request(app)
    .post(`/api/quizzes/${quizId}/start-session`)
    .set(authHeader(teacher));

  assert.equal(res.status, 200);
  assert.ok(res.body.data.session);
  assert.equal(res.body.data.session.status, "active");
  assert.equal(res.body.data.session.quizId.toString(), quizId.toString());

  const sessionCount = await QMQuizSession.countDocuments({ quizId });
  assert.equal(sessionCount, 1);
});
