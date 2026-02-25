import express from "express";
import { chatWithBot } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithBot);

export default router;