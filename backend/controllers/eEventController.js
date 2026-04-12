import * as eventService from "../services/eEventService.js";
import EEvent from "../models/EEvent.js";

// @desc    Create event — POST /api/events with campaignId in body
// @access  Private (Admin/Teacher)
export const createEventFromBody = async (req, res) => {
  try {
    const { campaignId, ...rest } = req.body;
    const eventData = {
      ...rest,
      campaignId,
      createdBy: req.user.id,
    };

    const newEvent = await eventService.createEvent(eventData);
    res.status(201).json({
      success: true,
      data: newEvent,
      message: "Event created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/campaigns/:campaignId/events
// @access  Private (Admin/Teacher)
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      campaignId: req.params.campaignId, // From the URL
      createdBy: req.user.id, // From the JWT Token
    };

    const newEvent = await eventService.createEvent(eventData);
    res.status(201).json({ success: true, data: newEvent, message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all events (filtered by campaign or type)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const result = await eventService.getEvents(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or has been deleted" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin/Teacher)
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: updatedEvent, message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Soft delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await eventService.softDeleteEvent(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fixAllEventStatus = async (req, res) => {
  try {
    const result = await EEvent.updateMany(
      { status: { $ne: "Published" } },
      { $set: { status: "Published" } }
    );
    res.json({ success: true, message: `Updated ${result.modifiedCount} events to Published` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};