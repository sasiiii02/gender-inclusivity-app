import express from "express";
import * as lessonController from "../controllers/lessonController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - Teacher and Admin can manage lessons
router.put(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  lessonController.updateLesson
);

router.delete(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  lessonController.deleteLesson
);

export default router;
