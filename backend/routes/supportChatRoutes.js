import express from "express";
import { sendChatMessage } from "../controllers/supportChatController.js";
import { validateChatMessage } from "../validations/supportChatValidation.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/chat",
  protect,
  validateChatMessage,
  sendChatMessage
);

export default router;