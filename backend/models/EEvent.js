import mongoose from "mongoose";

const eEventSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ECampaign",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    eventType: {
      type: String,
      enum: ["Workshop", "Seminar", "Debate", "Awareness Drive"],
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Only enforce future dates when a new event is created or the date is modified
          if (this.isModified("eventDate")) {
            return value > new Date();
          }
          return true;
        },
        message: "Event date must be in the future",
      },
    },
    location: {
      type: String,
      required: [true, "Location or Meeting Link is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Maximum capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    speaker: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Completed", "Cancelled"],
      default: "Draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Used for soft-deleting events
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying
eEventSchema.index({ campaignId: 1 });
eEventSchema.index({ eventDate: 1 }); // Optimizes filtering for "upcoming events"

const EEvent = mongoose.model("EEvent", eEventSchema);
export default EEvent;