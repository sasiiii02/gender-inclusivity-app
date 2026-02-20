import Joi from "joi";

export const createCampaignSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().messages({
    "string.empty": "Campaign title cannot be empty",
    "string.min": "Campaign title must be at least 5 characters long",
  }),
  description: Joi.string().min(20).required().messages({
    "string.min": "Description needs to be at least 20 characters for clarity",
  }),
  bannerImage: Joi.string().uri().optional().allow(""), // Must be a valid URL if provided
  startDate: Joi.date().iso().required().messages({
    "date.format": "Start date must be a valid ISO date",
  }),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.min": "End date must be after or equal to the start date",
  }),
  status: Joi.string().valid("Draft", "Active", "Completed", "Archived").optional(),
  targetAudience: Joi.array().items(Joi.string()).optional(),
});

// For updates, we make fields optional so the user can update just the title, or just the status
export const updateCampaignSchema = createCampaignSchema.fork(
  ["title", "description", "startDate", "endDate"], 
  (schema) => schema.optional()
);