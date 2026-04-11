import * as eventService from "../services/eEventService.js";
import EEvent from "../models/EEvent.js";

const NAGER_API_URL = "https://date.nager.at/api/v3/publicholidays";
const LK_FIXED_FALLBACK_MM_DD = new Set(["01-01", "02-04", "05-01", "12-25"]);
const holidayCacheByYear = new Map();

const toColomboDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  // Sri Lanka timezone is UTC+05:30 with no DST.
  const offsetMs = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + offsetMs);
};

const getColomboDateKey = (dateValue) => {
  const colomboDate = toColomboDate(dateValue);
  if (!colomboDate) return "";

  const y = colomboDate.getUTCFullYear();
  const m = String(colomboDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(colomboDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isColomboWeekend = (dateValue) => {
  const colomboDate = toColomboDate(dateValue);
  if (!colomboDate) return false;
  const day = colomboDate.getUTCDay();
  return day === 0 || day === 6;
};

const fetchSriLankaHolidaysForYear = async (year) => {
  if (holidayCacheByYear.has(year)) {
    return holidayCacheByYear.get(year);
  }

  const response = await fetch(`${NAGER_API_URL}/${year}/LK`);
  if (!response.ok) {
    throw new Error(`Holiday API failed with ${response.status}`);
  }

  const holidays = await response.json();
  const dateSet = new Set((holidays || []).map((h) => h.date).filter(Boolean));
  holidayCacheByYear.set(year, dateSet);
  return dateSet;
};

const isSriLankaHoliday = async (dateValue) => {
  const dateKey = getColomboDateKey(dateValue);
  if (!dateKey) return false;

  const year = Number(dateKey.slice(0, 4));
  const mmdd = dateKey.slice(5);

  try {
    const holidaySet = await fetchSriLankaHolidaysForYear(year);
    if (holidaySet.has(dateKey)) {
      return true;
    }
  } catch (error) {
    // Fall back to a small fixed list on API/network failure.
    if (LK_FIXED_FALLBACK_MM_DD.has(mmdd)) {
      return true;
    }
  }

  return false;
};

// @desc    Create a new event
// @route   POST /api/campaigns/:campaignId/events
// @access  Private (Admin/Teacher)
export const createEvent = async (req, res) => {
  try {
    if (isColomboWeekend(req.body.eventDate)) {
      return res.status(400).json({
        success: false,
        message: "Events can only be created on weekdays (Sri Lanka time).",
      });
    }

    const holiday = await isSriLankaHoliday(req.body.eventDate);
    if (holiday) {
      return res.status(400).json({
        success: false,
        message: "Selected date is a Sri Lankan public holiday. Please choose a normal day.",
      });
    }

    const normalizedTitle = (req.body.title || "").trim();
    const normalizedLocation = (req.body.location || "").trim();
    const normalizedSpeaker = (req.body.speaker || "").trim();
    const normalizedEventDate = new Date(req.body.eventDate);

    const existingEvent = await EEvent.findOne({
      campaignId: req.params.campaignId,
      title: normalizedTitle,
      eventDate: normalizedEventDate,
      location: normalizedLocation,
      speaker: normalizedSpeaker,
      isDeleted: false,
    });

    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message: "Duplicate event detected. This event already exists.",
      });
    }

    const eventData = {
      ...req.body,
      title: normalizedTitle,
      location: normalizedLocation,
      speaker: normalizedSpeaker,
      eventDate: normalizedEventDate,
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
    res.status(200).json({ success: true, message: "Event deleted successfully" });
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