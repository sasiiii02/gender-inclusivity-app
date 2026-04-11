import express from "express";
import * as lessonController from "../controllers/lessonController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";
import uploadLessonPdf from "../middleware/uploadLessonPdf.js";

const router = express.Router();

// Protected routes - Teacher and Admin can manage lessons
router.put(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  uploadLessonPdf.single("pdf"),
  lessonController.updateLesson
);

router.patch(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  uploadLessonPdf.single("pdf"),
  lessonController.patchLesson
);

router.delete(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  lessonController.deleteLesson
);

export default router;
