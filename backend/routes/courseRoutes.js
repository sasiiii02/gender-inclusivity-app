import express from "express";
import * as courseController from "../controllers/courseController.js";
import * as lessonController from "../controllers/lessonController.js";
import * as enrollmentController from "../controllers/enrollmentController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (Anyone can view courses)
router.get("/", courseController.getAllCourses);

// Nested routes - must come before /:id to avoid route conflicts
// Lesson routes nested under courses
// Public route - Get lessons by course
router.get("/:courseId/lessons", lessonController.getLessonsByCourse);

// Protected routes - Teacher and Admin can manage lessons
router.post(
  "/:courseId/lessons",
  protect,
  authorize("teacher", "admin"),
  lessonController.addLessonToCourse
);

// Enrollment route nested under courses
// Protected route - Student only
router.post(
  "/:courseId/enroll",
  protect,
  authorize("student"),
  enrollmentController.enrollInCourse
);

// Get students enrolled in a course (Teacher/Admin)
router.get(
  "/:courseId/students",
  protect,
  authorize("teacher", "admin"),
  enrollmentController.getStudentsByCourse
);

// Course CRUD routes
router.get("/:id", protect, courseController.getCourseById);

// Protected routes - Teacher only for creating courses
router.post(
  "/",
  protect,
  authorize("teacher"),
  courseController.createCourse
);

// Protected routes - Teacher and Admin can update/delete
router.put(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  courseController.updateCourse
);

router.patch(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  courseController.updateCourse
);

router.delete(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  courseController.deleteCourse
);

export default router;
