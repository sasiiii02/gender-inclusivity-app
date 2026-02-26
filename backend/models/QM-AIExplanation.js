import mongoose from "mongoose";

const aiExplanationSchema = new mongoose.Schema(
  {
    studentQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QMStudentQuiz",
      required: true,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QMQuestion",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QMQuiz",
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["ai", "fallback"],
      default: "ai",
    },
    feedback: {
      helpful: {
        type: Boolean,
        default: null,
      },
      reportedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure one explanation per question per quiz attempt
aiExplanationSchema.index(
  { studentQuizId: 1, questionId: 1 },
  { unique: true },
);

// Index for faster queries
aiExplanationSchema.index({ studentId: 1, createdAt: -1 });

const QMAIExplanation = mongoose.model("QMAIExplanation", aiExplanationSchema);
export default QMAIExplanation;
