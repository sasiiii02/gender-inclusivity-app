import express from "express";
import * as feedbackController from "../controllers/eFeedbackController.js";
import protect from "../middleware/authMiddleware.js"; // Only need protect here
import { validate } from "../middleware/validateMiddleware.js";
import { createFeedbackSchema } from "../validations/eFeedbackValidator.js";

const router = express.Router();

// Public route to view feedback
router.get("/events/:eventId", feedbackController.getEventFeedback);
router.get("/events/:eventId/stats", feedbackController.getEventStats);

// Protected routes
router.get("/my-feedbacks", protect, feedbackController.getMyFeedback);

// Protected route to submit feedback
router.post(
  "/events/:eventId",
  protect,
  validate(createFeedbackSchema),
  feedbackController.submitFeedback
);

router.delete("/:id", protect, feedbackController.deleteFeedback);

export default router;