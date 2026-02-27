import mongoose from "mongoose";

const eFeedbackSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EEvent",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      required: [true, "Comments are required"],
      trim: true,
    },
    inclusivityImpact: {
      type: String,
      default: "", // e.g., "This workshop changed my perspective on gender roles."
    },
  },
  {
    timestamps: true,
  }
);

// A student can only leave ONE feedback per event
eFeedbackSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const EFeedback = mongoose.model("EFeedback", eFeedbackSchema);
export default EFeedback;