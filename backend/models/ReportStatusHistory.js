import mongoose from "mongoose";

const reportStatusHistorySchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseStatus",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReportStatusHistory = mongoose.model(
  "ReportStatusHistory",
  reportStatusHistorySchema
);

export default ReportStatusHistory;