import express from "express";
import * as eventController from "../controllers/eEventController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createEventSchema, updateEventSchema } from "../validations/eEventValidator.js";

const router = express.Router();

// Public routes
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

// Protected routes (Admins and Teachers)
router.post(
  "/campaigns/:campaignId", // Creates an event under a specific campaign
  protect,
  authorize("admin", "teacher"),
  validate(createEventSchema),
  eventController.createEvent
);

router.put(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  validate(updateEventSchema),
  eventController.updateEvent
);

router.delete(
  "/:id",
  protect,
  authorize("admin"), // Only admins can soft-delete events
  eventController.deleteEvent
);

export default router;