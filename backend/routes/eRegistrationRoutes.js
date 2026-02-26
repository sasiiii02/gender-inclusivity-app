import express from "express";
import * as registrationController from "../controllers/eRegistrationController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { registerEventSchema } from "../validations/eRegistrationValidator.js";

const router = express.Router();

// Bulk attendance route
router.patch(
  "/bulk-attend",
  protect,
  authorize("admin", "teacher"),
  registrationController.bulkMarkAttendance
);

// Student/Teacher routes
router.post(
  "/events/:eventId/register",
  protect,
  authorize("student", "teacher", "admin"), // Anyone can attend an event
  validate(registerEventSchema),
  registrationController.registerForEvent
);

router.get(
  "/my-registrations",
  protect,
  registrationController.getMyRegistrations
);

router.delete(
  "/:id",
  protect,
  registrationController.cancelRegistration
);

// Admin/Teacher route to view who registered for a specific event
router.get(
  "/events/:eventId/attendees",
  protect,
  authorize("admin", "teacher"),
  registrationController.getEventRegistrations
);

// Teacher/Admin route to mark attendance
router.patch(
  "/:id/attend",
  protect,
  authorize("admin", "teacher"),
  registrationController.markAttendance
);

export default router;