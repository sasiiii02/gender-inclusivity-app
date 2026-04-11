import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  createQuestionSchema,
  bulkQuestionsSchema,
} from "../validations/QM-quizValidation.js";
import * as questionController from "../controllers/QM-questionController.js";

const router = express.Router({ mergeParams: true });

// Required when router is mounted at /api/questions; harmless when nested under /api/quizzes
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
