import express from "express";
import { createReport,getMyReports,getAllReports,updateReportStatus } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",protect,createReport);
router.get("/my-reports",protect,getMyReports);
router.get("/all-reports",getAllReports);
router.patch("/:id/status", protect, updateReportStatus);

export default router

