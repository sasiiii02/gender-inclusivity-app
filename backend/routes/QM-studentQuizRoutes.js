import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  joinQuizSchema,
  submitAnswerSchema,
} from "../validations/QM-quizValidation.js";
import * as studentQuizController from "../controllers/QM-studentQuizController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student quiz routes
router.post(
  "/join",
  authorize("student"),
  validate(joinQuizSchema),
  studentQuizController.joinQuiz,
);
router.get(
  "/history",
  authorize("student"),
  studentQuizController.getQuizHistory,
);

// Active quiz routes
router.get(
  "/:studentQuizId/questions",
  authorize("student"),
  studentQuizController.getStudentQuizQuestions,
);
router.post(
  "/:studentQuizId/answer",
  authorize("student"),
  validate(submitAnswerSchema),
  studentQuizController.submitAnswer,
);
router.post(
  "/:studentQuizId/complete",
  authorize("student"),
  studentQuizController.completeQuiz,
);
router.get(
  "/:studentQuizId/result",
  authorize("student"),
  studentQuizController.getQuizResult,
);

export default router;
