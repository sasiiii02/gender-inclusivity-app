import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { aiFeedbackSchema } from "../validations/QM-quizValidation.js";
import * as aiController from "../controllers/QM-aiController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(authorize("student"));

// Get explanation for a specific question
router.post(
  "/explain/:studentQuizId/:questionId",
  aiController.getQuestionExplanation,
);

// Generate explanations for all questions in a quiz
router.post("/explain-all/:studentQuizId", aiController.getAllExplanations);

// Get all saved explanations for a quiz
router.get("/explanations/:studentQuizId", aiController.getQuizExplanations);

// Provide feedback on explanation helpfulness
router.post(
  "/feedback/:explanationId",
  validate(aiFeedbackSchema),
  aiController.provideExplanationFeedback,
);

export default router;
