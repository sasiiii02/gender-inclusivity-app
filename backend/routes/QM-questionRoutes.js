import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  createQuestionSchema,
  bulkQuestionsSchema,
} from "../validations/QM-quizValidation.js";
import * as questionController from "../controllers/QM-questionController.js";

const router = express.Router({ mergeParams: true });

// All routes require authentication and teacher role
router.use(protect);
router.use(authorize("teacher", "admin"));

// Question routes
router
  .route("/")
  .post(validate(createQuestionSchema), questionController.addQuestion)
  .get(questionController.getQuizQuestions);

router.post(
  "/bulk",
  validate(bulkQuestionsSchema),
  questionController.addBulkQuestions,
);
router.put("/reorder", questionController.reorderQuestions);

router
  .route("/:id")
  .put(validate(createQuestionSchema), questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

export default router;
