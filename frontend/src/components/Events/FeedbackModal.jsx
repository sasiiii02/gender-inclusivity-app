import React, { useState } from 'react';
import { campaignEventsApi } from '../../api/campaignEventsApi';

const FeedbackModal = ({ eventId, eventTitle, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await campaignEventsApi.submitFeedback(eventId, { rating, comment });
      alert("Thank you! Your feedback has been submitted.");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Feedback error:", err);
      alert(err.response?.data?.message || "Failed to submit feedback. You may have already reviewed this event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Leave Feedback</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">How was your experience at <strong>{eventTitle}</strong>?</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5 Stars)</label>
            <input 
              type="range" min="1" max="5" step="1" 
              value={rating} onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="text-center text-2xl mt-2 text-yellow-400 font-bold">
              {"★".repeat(rating)}{"☆".repeat(5-rating)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comments (Optional)</label>
            <textarea 
              rows="3" value={comment} onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              placeholder="What did you learn? What could be improved?"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;