import express from "express";
import { createReport,getMyReports,getAllReports,updateReportStatus,addReportResponse, getAllResponses,
  getMyReportResponses,getReportTimeline,closeReport , getReportStats, getReportCategories} from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get report categories
router.get("/categories", protect, getReportCategories);

// User - create a report
router.post("/create",protect,createReport);
// User - view my reports
router.get("/my-reports",protect,getMyReports);
// Admin - view all reports
router.get("/all-reports",getAllReports);
// Admin - update report status
router.patch("/:id/status", protect, updateReportStatus);
// Admin - add response to a report
router.post("/:id/respond", protect, addReportResponse);
// Admin - view all report responses
router.get("/responses", protect, getAllResponses);
// Student - view responses for one of their reports
router.get("/:id/responses", protect, getMyReportResponses);
// Get report timeline (status changes + responses)
router.get("/:id/timeline", protect, getReportTimeline);
// Admin - close a report
router.patch("/:id/close", protect, closeReport);
// Admin - get report statistics
router.get("/stats",protect, getReportStats);

export default router

