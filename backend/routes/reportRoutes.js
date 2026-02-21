import express from "express";
import { createReport,getMyReports,getAllReports } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",protect,createReport);
router.get("/my-reports",protect,getMyReports);
router.get("/all-reports",getAllReports);

export default router

