import express from "express";
import { createReport,getMyReports,getAllReports,updateReportStatus,addReportResponse, getAllResponses,
  getMyReportResponses,getReportTimeline,closeReport , getReportStats} from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",protect,createReport);
router.get("/my-reports",protect,getMyReports);
router.get("/all-reports",getAllReports);
router.patch("/:id/status", protect, updateReportStatus);
router.post("/:id/respond", protect, addReportResponse);
router.get("/responses", protect, getAllResponses);
router.get("/:id/responses", protect, getMyReportResponses);
router.get("/:id/timeline", protect, getReportTimeline);
router.patch("/:id/close", protect, closeReport);
router.get("/stats",protect, getReportStats);
export default router

