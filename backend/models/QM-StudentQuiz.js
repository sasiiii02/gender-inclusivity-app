import mongoose from "mongoose";

const studentQuizSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QMQuiz",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QMQuestion",
          required: true,
        },
        selectedOption: {
          type: String,
        },
        selectedOptions: [String], // For multiple-answer questions
        isCorrect: {
          type: Boolean,
          default: false,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number, // in seconds
          default: 0,
        },
        answeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalMarksObtained: {
      type: Number,
      default: 0,
    },
    totalMarksPossible: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned", "timed-out"],
      default: "in-progress",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    timeRemaining: {
      type: Number, // in seconds
    },
    ipAddress: {
      type: String,
    },
    deviceInfo: {
      type: String,
    },
    review: {
      flaggedQuestions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QMQuestion",
        },
      ],
      teacherRemarks: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure unique attempts
studentQuizSchema.index(
  { quizId: 1, studentId: 1, attemptNumber: 1 },
  { unique: true },
);

// Pre-save middleware to calculate percentage
studentQuizSchema.pre("save", function (next) {
  if (this.totalMarksPossible > 0) {
    this.percentage = (this.totalMarksObtained / this.totalMarksPossible) * 100;
    this.percentage = Math.round(this.percentage * 100) / 100; // Round to 2 decimals
  }
  next();
});

const QMStudentQuiz = mongoose.model("QMStudentQuiz", studentQuizSchema);
export default QMStudentQuiz;
