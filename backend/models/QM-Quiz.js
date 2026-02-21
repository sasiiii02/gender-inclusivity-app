import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, "Grade/Class is required"],
      trim: true,
    },
    passcode: {
      type: String,
      required: [true, "Quiz passcode is required"],
      minlength: [4, "Passcode must be at least 4 characters"],
      maxlength: [10, "Passcode cannot exceed 10 characters"],
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Quiz duration is required"],
      min: [1, "Duration must be at least 1 minute"],
      max: [180, "Duration cannot exceed 180 minutes"],
    },
    passMarks: {
      type: Number,
      required: [true, "Pass marks are required"],
      min: [0, "Pass marks cannot be negative"],
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "active", "completed", "archived"],
      default: "draft",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    qrCode: {
      type: String,
    },
    quizLink: {
      type: String,
    },
    settings: {
      shuffleQuestions: {
        type: Boolean,
        default: false,
      },
      showResultsImmediately: {
        type: Boolean,
        default: true,
      },
      allowReview: {
        type: Boolean,
        default: false,
      },
      maxAttempts: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
    },
    statistics: {
      averageScore: {
        type: Number,
        default: 0,
      },
      highestScore: {
        type: Number,
        default: 0,
      },
      lowestScore: {
        type: Number,
        default: 0,
      },
      totalAttempts: {
        type: Number,
        default: 0,
      },
      passRate: {
        type: Number,
        default: 0,
      },
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
quizSchema.index({ teacherId: 1, status: 1 });
quizSchema.index({ quizLink: 1 }, { unique: true, sparse: true });
quizSchema.index({ passcode: 1 });

// Pre-save middleware to generate quiz link
quizSchema.pre("save", async function (next) {
  if (!this.quizLink) {
    // Generate unique quiz link using timestamp and random string
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.quizLink = `quiz-${this._id}-${randomStr}`;
  }
  next();
});

const QMQuiz = mongoose.model("QMQuiz", quizSchema);
export default QMQuiz;
