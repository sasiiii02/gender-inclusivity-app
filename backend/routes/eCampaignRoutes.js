import express from "express";
import * as campaignController from "../controllers/eCampaignController.js";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createCampaignSchema, updateCampaignSchema } from "../validations/eCampaignValidator.js";

const router = express.Router();

// Public routes (Anyone can view campaigns)
router.get("/", campaignController.getCampaigns);
router.get("/:id", campaignController.getCampaignById);

// Protected Admin routes
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createCampaignSchema),
  campaignController.createCampaign
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateCampaignSchema),
  campaignController.updateCampaign
);

router.patch(
  "/:id/archive",
  protect,
  authorize("admin"),
  campaignController.archiveCampaign
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  campaignController.archiveCampaign
);

export default router;