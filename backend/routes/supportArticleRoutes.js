import express from "express";
import {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/supportArticleController.js";

import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/:id", getSingleArticle);

// Admin routes
router.post("/", protect, upload.single('pdf'), createArticle);
router.put("/:id", protect, upload.single('pdf'), updateArticle);
router.delete("/:id", protect, deleteArticle);

export default router;