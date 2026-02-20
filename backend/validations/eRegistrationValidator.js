import Joi from "joi";

export const registerEventSchema = Joi.object({
  accessibilityNeeds: Joi.string().max(300).optional().allow("").messages({
    "string.max": "Accessibility needs description is too long (max 300 characters)",
  }),
});