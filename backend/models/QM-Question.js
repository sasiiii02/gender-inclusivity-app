import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QMQuiz",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ["mcq", "true-false", "multiple-answer"],
      default: "mcq",
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    correctAnswer: {
      type: String, // For backward compatibility
    },
    marks: {
      type: Number,
      required: [true, "Marks for question are required"],
      min: [1, "Marks must be at least 1"],
      max: [100, "Marks cannot exceed 100"],
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: [0, "Negative marks cannot be negative"],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    explanation: {
      type: String,
      trim: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    orderIndex: {
      type: Number,
      required: true,
    },
    timeLimit: {
      type: Number, // in seconds, 0 means no per-question time limit
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
questionSchema.index({ quizId: 1, orderIndex: 1 });

// Pre-save middleware to maintain backward compatibility
questionSchema.pre("save", function (next) {
  // Set correctAnswer from options for backward compatibility
  if (this.options && this.options.length > 0) {
    const correctOption = this.options.find((opt) => opt.isCorrect);
    if (correctOption) {
      this.correctAnswer = correctOption.text;
    }
  }
  next();
});

const QMQuestion = mongoose.model("QMQuestion", questionSchema);
export default QMQuestion;
