import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import QMQuiz from "../models/QM-Quiz.js";
import QMQuestion from "../models/QM-Question.js";
import * as quizService from "../services/QM-quizService.js";

const origQuizFindOne = QMQuiz.findOne;
const origQuizFindOneAndUpdate = QMQuiz.findOneAndUpdate;
const origQuestionCount = QMQuestion.countDocuments;
const origQuestionFind = QMQuestion.find;

function restoreQuizMocks() {
  QMQuiz.findOne = origQuizFindOne;
  QMQuiz.findOneAndUpdate = origQuizFindOneAndUpdate;
  QMQuestion.countDocuments = origQuestionCount;
  QMQuestion.find = origQuestionFind;
}

afterEach(() => {
  restoreQuizMocks();
});

test("publishQuiz rejects when quiz has no questions", async () => {
  QMQuestion.countDocuments = async () => 0;

  await assert.rejects(
    () => quizService.publishQuiz("507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"),
    /no questions/i,
  );
});

test("publishQuiz sets published status, totalMarks, and totalQuestions", async () => {
  QMQuestion.countDocuments = async () => 2;
  QMQuestion.find = async () => [{ marks: 4 }, { marks: 6 }];

  let capturedUpdate;
  QMQuiz.findOneAndUpdate = async (_filter, update) => {
    capturedUpdate = update;
    return { ...update, _id: "quiz-1" };
  };

  const result = await quizService.publishQuiz(
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
  );

  assert.equal(capturedUpdate.status, "published");
  assert.equal(capturedUpdate.totalMarks, 10);
  assert.equal(capturedUpdate.totalQuestions, 2);
  assert.equal(result.status, "published");
});

test("getQuizById throws when quiz does not exist", async () => {
  QMQuiz.findOne = () => ({
    populate() {
      return Promise.resolve(null);
    },
  });

  await assert.rejects(
    () => quizService.getQuizById("507f1f77bcf86cd799439099"),
    /Quiz not found/i,
  );
});

test("startQuizSession rejects when quiz is not published", async () => {
  QMQuiz.findOne = async () => ({
    _id: "q1",
    status: "draft",
    duration: 30,
    save: async () => {},
  });

  await assert.rejects(
    () =>
      quizService.startQuizSession(
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012",
      ),
    /published/i,
  );
});
