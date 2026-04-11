import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  createQuizSchema,
  updateQuizSchema,
} from "../validations/QM-quizValidation.js";
import * as quizController from "../controllers/QM-quizController.js";
import questionRoutes from "./QM-questionRoutes.js";

const router = express.Router();

// All routes require authentication and teacher role
router.use(protect);
router.use(authorize("teacher", "admin"));

// Nested questions (must run after protect so params + auth match other quiz routes)
router.use("/:quizId/questions", questionRoutes);

// Quiz CRUD
router
  .route("/")
  .post(validate(createQuizSchema), quizController.createQuiz)
  .get(quizController.getQuizzes);

router
  .route("/:id")
  .get(quizController.getQuizById)
  .put(validate(updateQuizSchema), quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

// Quiz actions
router.put("/:id/publish", quizController.publishQuiz);
router.post("/:id/start", quizController.startQuiz);
router.post("/:id/start-session", quizController.startQuiz);
router.post("/:id/end", quizController.endQuiz);

// Quiz stats and results
router.get("/:id/live", quizController.getLiveStats);
router.get("/:id/results", quizController.getQuizResults);

export default router;
