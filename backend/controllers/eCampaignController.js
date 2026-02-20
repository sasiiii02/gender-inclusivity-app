import * as campaignService from "../services/eCampaignService.js";

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Admin)
export const createCampaign = async (req, res) => {
  try {
    // Attach the logged-in user's ID as the creator
    const campaignData = {
      ...req.body,
      createdBy: req.user.id, 
    };

    const newCampaign = await campaignService.createCampaign(campaignData);
    res.status(201).json({ success: true, data: newCampaign, message: "Campaign created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all campaigns (with filtering & pagination)
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req, res) => {
  try {
    const result = await campaignService.getCampaigns(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Admin)
export const updateCampaign = async (req, res) => {
  try {
    const updatedCampaign = await campaignService.updateCampaign(req.params.id, req.body);
    if (!updatedCampaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, data: updatedCampaign, message: "Campaign updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Soft Delete (Archive) a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin)
export const archiveCampaign = async (req, res) => {
  try {
    const archivedCampaign = await campaignService.archiveCampaign(req.params.id);
    if (!archivedCampaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, message: "Campaign archived successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};