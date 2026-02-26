import mongoose from "mongoose";
import EFeedback from "../models/EFeedback.js";
import ERegistration from "../models/ERegistration.js";

// 1. Submit Feedback
export const submitFeedback = async (eventId, userId, feedbackData) => {
  // THE BIG FLEX: Verify the user actually attended the event!
  const registration = await ERegistration.findOne({ eventId, userId });
  
  if (!registration) {
    throw new Error("You must be registered for this event to leave feedback.");
  }
  
  if (registration.attendanceStatus !== "Attended") {
    throw new Error("You can only leave feedback for events you have actually attended.");
  }

  // Check if they already left feedback
  const existingFeedback = await EFeedback.findOne({ eventId, userId });
  if (existingFeedback) {
    throw new Error("You have already submitted feedback for this event.");
  }

  const feedback = new EFeedback({
    eventId,
    userId,
    ...feedbackData,
  });

  return await feedback.save();
};

// 2. Get all feedback for a specific event
export const getEventFeedback = async (eventId) => {
  return await EFeedback.find({ eventId })
    .populate("userId", "name") // Only show the name, not the email/password
    .sort({ createdAt: -1 }); // Newest first
};

// 3. Get My Feedbacks (For the student dashboard)
export const getMyFeedback = async (userId) => {
  return await EFeedback.find({ userId })
    .populate("eventId", "title eventDate")
    .sort({ createdAt: -1 });
};

// 4. Delete My Feedback
export const deleteFeedback = async (feedbackId, userId) => {
  // We check userId too so a student can only delete THEIR OWN feedback
  const feedback = await EFeedback.findOneAndDelete({ _id: feedbackId, userId });
  if (!feedback) {
    throw new Error("Feedback not found or you are not authorized to delete it");
  }
  return feedback;
};

// 5. Get Event Rating Statistics (THE BIG FLEX)
export const getEventStats = async (eventId) => {
  const stats = await EFeedback.aggregate([
    { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
    { 
      $group: { 
        _id: "$eventId", 
        averageRating: { $avg: "$rating" }, 
        totalReviews: { $sum: 1 } 
      } 
    }
  ]);
  return stats[0] || { averageRating: 0, totalReviews: 0 };
};