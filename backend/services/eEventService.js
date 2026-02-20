import EEvent from "../models/EEvent.js";

// 1. Create a new event
export const createEvent = async (eventData) => {
  const event = new EEvent(eventData);
  return await event.save();
};

// 2. Get all events (Filter by Campaign or Type)
export const getEvents = async (query) => {
  const { campaignId, eventType, page = 1, limit = 10 } = query;
  const skip = (page - 1) * parseInt(limit);

  // ALWAYS hide soft-deleted events
  const filter = { isDeleted: false };
  
  if (campaignId) filter.campaignId = campaignId;
  if (eventType) filter.eventType = eventType;

  // Populate campaign details so the frontend knows which campaign this event belongs to
  const events = await EEvent.find(filter)
    .populate("campaignId", "title status")
    .populate("createdBy", "name email")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ eventDate: 1 }); // Sort by upcoming dates first!

  const total = await EEvent.countDocuments(filter);

  return {
    events,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// 3. Get a single event by ID
export const getEventById = async (id) => {
  return await EEvent.findOne({ _id: id, isDeleted: false })
    .populate("campaignId", "title")
    .populate("createdBy", "name email");
};

// 4. Update an event
export const updateEvent = async (id, updateData) => {
  return await EEvent.findOneAndUpdate(
    { _id: id, isDeleted: false }, 
    updateData, 
    { new: true, runValidators: true }
  );
};

// 5. Soft Delete an event
export const softDeleteEvent = async (id) => {
  return await EEvent.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};