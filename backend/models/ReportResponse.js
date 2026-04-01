import mongoose from "mongoose";
// Schema for responses to user reports 
const reportResponseSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReportResponse = mongoose.model("ReportResponse", reportResponseSchema);

export default ReportResponse;