import mongoose from "mongoose";

const quizSessionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QMQuiz",
      required: true,
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "active", "paused", "ended"],
      default: "waiting",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    activeStudents: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastActiveAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["active", "completed", "disconnected"],
          default: "active",
        },
      },
    ],
    totalAttendance: {
      type: Number,
      default: 0,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    liveStats: {
      averageScore: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        default: 0,
      },
      questionWisePerformance: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QMQuestion",
          },
          correctCount: {
            type: Number,
            default: 0,
          },
          totalAttempts: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Index for live tracking
quizSessionSchema.index({ quizId: 1, status: 1 });

const QMQuizSession = mongoose.model("QMQuizSession", quizSessionSchema);
export default QMQuizSession;
