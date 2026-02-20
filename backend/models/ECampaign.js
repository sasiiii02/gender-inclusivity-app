import mongoose from "mongoose";

const eCampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Campaign description is required"],
    },
    bannerImage: {
      type: String,
      default: "", // Will be populated by Cloudinary URL later
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // 'this' refers to the current document being saved
          return this.startDate <= value;
        },
        message: "End date must be after or equal to the start date",
      },
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Completed", "Archived"],
      default: "Draft",
    },
    targetAudience: [
      {
        type: String, // e.g., ["Students", "Teachers", "Parents"]
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming 'User.js' is shared among the group
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const ECampaign = mongoose.model("ECampaign", eCampaignSchema);
export default ECampaign;