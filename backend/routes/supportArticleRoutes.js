import express from "express";
import {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/supportArticleController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/:id", getSingleArticle);

// Admin routes
router.post("/", protect, createArticle);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);

export default router;