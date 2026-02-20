import ECampaign from "../models/ECampaign.js";

// 1. Create a new campaign
export const createCampaign = async (campaignData) => {
  const campaign = new ECampaign(campaignData);
  return await campaign.save();
};

// 2. Get all campaigns with Pagination, Search, and Filtering
export const getCampaigns = async (query) => {
  const { search, status, page = 1, limit = 10 } = query;
  const skip = (page - 1) * parseInt(limit);

  // Build the dynamic filter object
  const filter = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (search) {
    // $regex allows partial matches, $options: "i" makes it case-insensitive
    filter.title = { $regex: search, $options: "i" };
  }

  // Fetch data and populate the creator's name and email
  const campaigns = await ECampaign.find(filter)
    .populate("createdBy", "name email")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 }); // Newest first

  const total = await ECampaign.countDocuments(filter);

  // Return clean data and pagination metadata for the React frontend
  return {
    campaigns,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// 3. Get a single campaign by ID
export const getCampaignById = async (id) => {
  return await ECampaign.findById(id).populate("createdBy", "name email");
};

// 4. Update a campaign
export const updateCampaign = async (id, updateData) => {
  // { new: true } returns the updated document, runValidators ensures schema rules still apply
  return await ECampaign.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// 5. Soft Delete / Archive a campaign
export const archiveCampaign = async (id) => {
  // We don't delete it, we just change the status to "Archived"
  return await ECampaign.findByIdAndUpdate(id, { status: "Archived" }, { new: true });
};