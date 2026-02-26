import Joi from "joi";

export const createFeedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot be more than 5",
  }),
  comments: Joi.string().min(10).max(500).required().messages({
    "string.min": "Please provide a slightly more detailed comment (at least 10 characters)",
  }),
  inclusivityImpact: Joi.string().max(500).optional().allow(""),
});