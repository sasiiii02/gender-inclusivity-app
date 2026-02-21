import Joi from "joi";

// Quiz creation validation
export const createQuizSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Quiz title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().max(500).optional().allow(""),
  subject: Joi.string().required().messages({
    "string.empty": "Subject is required",
  }),
  grade: Joi.string().required().messages({
    "string.empty": "Grade/Class is required",
  }),
  passcode: Joi.string().min(4).max(10).required().messages({
    "string.empty": "Passcode is required",
    "string.min": "Passcode must be at least 4 characters",
    "string.max": "Passcode cannot exceed 10 characters",
  }),
  duration: Joi.number().min(1).max(180).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 1 minute",
    "number.max": "Duration cannot exceed 180 minutes",
  }),
  passMarks: Joi.number().min(0).required().messages({
    "number.base": "Pass marks must be a number",
    "number.min": "Pass marks cannot be negative",
  }),
  settings: Joi.object({
    shuffleQuestions: Joi.boolean().default(false),
    showResultsImmediately: Joi.boolean().default(true),
    allowReview: Joi.boolean().default(false),
    maxAttempts: Joi.number().min(1).max(10).default(1),
  }).default(),
});

// Update quiz validation
export const updateQuizSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional().allow(""),
  subject: Joi.string().optional(),
  grade: Joi.string().optional(),
  passcode: Joi.string().min(4).max(10).optional(),
  duration: Joi.number().min(1).max(180).optional(),
  passMarks: Joi.number().min(0).optional(),
  status: Joi.string()
    .valid("draft", "published", "active", "completed", "archived")
    .optional(),
  settings: Joi.object({
    shuffleQuestions: Joi.boolean(),
    showResultsImmediately: Joi.boolean(),
    allowReview: Joi.boolean(),
    maxAttempts: Joi.number().min(1).max(10),
  }).optional(),
});

// Question validation
export const createQuestionSchema = Joi.object({
  questionText: Joi.string().required().messages({
    "string.empty": "Question text is required",
  }),
  questionType: Joi.string()
    .valid("mcq", "true-false", "multiple-answer")
    .default("mcq"),
  options: Joi.array()
    .min(2)
    .items(
      Joi.object({
        text: Joi.string().required(),
        isCorrect: Joi.boolean().default(false),
      }),
    )
    .required()
    .messages({
      "array.min": "At least 2 options are required",
    }),
  marks: Joi.number().min(1).max(100).required(),
  negativeMarks: Joi.number().min(0).default(0),
  imageUrl: Joi.string().uri().optional().allow(null),
  explanation: Joi.string().optional().allow(""),
  difficultyLevel: Joi.string()
    .valid("easy", "medium", "hard")
    .default("medium"),
  orderIndex: Joi.number().required(),
  timeLimit: Joi.number().min(0).default(0),
});

// Bulk questions validation
export const bulkQuestionsSchema = Joi.object({
  questions: Joi.array().items(createQuestionSchema).min(1).required(),
});

// Join quiz validation
export const joinQuizSchema = Joi.object({
  passcode: Joi.string().required().messages({
    "string.empty": "Passcode is required",
  }),
});

// Submit answer validation
export const submitAnswerSchema = Joi.object({
  questionId: Joi.string().required(),
  selectedOption: Joi.string().when("questionType", {
    is: "mcq",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  selectedOptions: Joi.array().items(Joi.string()).when("questionType", {
    is: "multiple-answer",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  timeSpent: Joi.number().min(0).optional(),
});
