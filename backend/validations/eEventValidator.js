import Joi from "joi";

export const createEventWithCampaignSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).required(),
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

export const createEventSchema = Joi.object({
  // campaignId is removed from here because we safely grab it from the URL in the controller!
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
  ["title", "eventType", "eventDate", "location", "capacity", "speaker"],
  (schema) => schema.optional()
);