import mongoose from "mongoose";

const eRegistrationSchema = new mongoose.Schema(
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
    accessibilityNeeds: {
      type: String,
      default: "None", // e.g., "Sign language interpreter", "Wheelchair access"
    },
    attendanceStatus: {
      type: String,
      enum: ["Registered", "Attended", "Cancelled", "No-Show"],
      default: "Registered",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user cannot register for the same event twice at the DB level!
eRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const ERegistration = mongoose.model("ERegistration", eRegistrationSchema);
export default ERegistration;