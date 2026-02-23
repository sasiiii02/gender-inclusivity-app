import express from "express";
import * as enrollmentController from "../controllers/enrollmentController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - Student only
router.get(
  "/my-enrollments",
  protect,
  authorize("student"),
  enrollmentController.getMyEnrollments
);

router.patch(
  "/:id",
  protect,
  authorize("student"),
  enrollmentController.updateEnrollment
);

router.put(
  "/:id/progress",
  protect,
  authorize("student"),
  enrollmentController.updateProgress
);

router.put(
  "/:id/complete",
  protect,
  authorize("student"),
  enrollmentController.markCourseComplete
);

export default router;
