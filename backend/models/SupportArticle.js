import mongoose from "mongoose";
// Schema for support articles in the help center
const supportArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Reporting", "Mental Health", "Policies", "General"],
      default: "General",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SupportArticle = mongoose.model(
  "SupportArticle",
  supportArticleSchema
);

export default SupportArticle;