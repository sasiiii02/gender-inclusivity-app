import express from "express";
import * as feedbackController from "../controllers/eFeedbackController.js";
import protect from "../middleware/authMiddleware.js"; // Only need protect here
import { validate } from "../middleware/validateMiddleware.js";
import { createFeedbackSchema } from "../validations/eFeedbackValidator.js";

const router = express.Router();

// Public route to view feedback
router.get("/events/:eventId", feedbackController.getEventFeedback);

// Protected route to submit feedback
router.post(
  "/events/:eventId",
  protect,
  validate(createFeedbackSchema),
  feedbackController.submitFeedback
);

export default router;