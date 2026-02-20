import Joi from "joi";

export const createEventSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid Campaign ID format",
    "string.length": "Invalid Campaign ID length",
  }),
  title: Joi.string().min(5).max(100).required(),
  eventType: Joi.string().valid("Workshop", "Seminar", "Debate", "Awareness Drive").required(),
  eventDate: Joi.date().iso().greater("now").required().messages({
    "date.greater": "Event date must be in the future",
  }),
  location: Joi.string().required(),
  capacity: Joi.number().integer().min(1).max(1000).required().messages({
    "number.min": "Capacity must be at least 1 person",
  }),
  speaker: Joi.string().required(),
  status: Joi.string().valid("Draft", "Published", "Completed", "Cancelled").optional(),
});

// Update schema makes fields optional
export const updateEventSchema = createEventSchema.fork(
  ["campaignId", "title", "eventType", "eventDate", "location", "capacity", "speaker"],
  (schema) => schema.optional()
);