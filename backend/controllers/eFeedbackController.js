import * as feedbackService from "../services/eFeedbackService.js";

// @desc    Submit feedback for an event
// @route   POST /api/feedbacks/events/:eventId
// @access  Private (Logged in users who attended)
export const submitFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.submitFeedback(
      req.params.eventId,
      req.user.id,
      req.body
    );
    res.status(201).json({ success: true, data: feedback, message: "Thank you for your feedback!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get feedback for a specific event
// @route   GET /api/feedbacks/events/:eventId
// @access  Public
export const getEventFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getEventFeedback(req.params.eventId);
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's feedback
// @route   GET /api/feedbacks/my-feedbacks
// @access  Private
export const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getMyFeedback(req.user.id);
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedbacks/:id
// @access  Private
export const deleteFeedback = async (req, res) => {
  try {
    await feedbackService.deleteFeedback(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get average rating stats for an event
// @route   GET /api/feedbacks/events/:eventId/stats
// @access  Public
export const getEventStats = async (req, res) => {
  try {
    const stats = await feedbackService.getEventStats(req.params.eventId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};