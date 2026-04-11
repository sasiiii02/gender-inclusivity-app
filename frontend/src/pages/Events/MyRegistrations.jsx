import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignEventsApi } from '../../api/campaignEventsApi';
import FeedbackModal from "../../components/Events/FeedbackModal";

const MyRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState(null);

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const res = await campaignEventsApi.getMyRegistrations();
      setRegistrations(res.data || res);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load your registrations.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    if (!window.confirm("Are you sure you want to cancel your registration? This cannot be undone.")) return;
    try {
      setCancelLoading(registrationId);
      await campaignEventsApi.cancelRegistration(registrationId);
      setRegistrations(registrations.filter(reg => reg._id !== registrationId));
      alert("Registration canceled successfully.");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel registration.");
    } finally {
      setCancelLoading(null);
    }
  };

  const handleOpenFeedback = (event) => {
    setSelectedEventForFeedback(event);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSuccess = () => {
    fetchMyRegistrations();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800">My Registrations</h1>
        <p className="text-gray-500 mt-2">Manage your upcoming gender inclusivity training sessions.</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {registrations.length === 0 && !error ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Upcoming Events</h2>
          <p className="text-gray-500 mb-6">You haven't registered for any events yet.</p>
          <button 
            onClick={() => navigate('/student/events')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800">{reg.eventId?.title || "Event Details Unavailable"}</h3>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>📅 {reg.eventId?.eventDate ? new Date(reg.eventId.eventDate).toLocaleDateString() : "Date TBD"}</p>
                  <p>📍 {reg.eventId?.location || "Location TBD"}</p>
                  <p>Status: <span className="font-semibold text-blue-600">{reg.attendanceStatus || "Registered"}</span></p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {reg.attendanceStatus !== 'Attended' && (
                  <button 
                    onClick={() => handleCancel(reg._id)}
                    disabled={cancelLoading === reg._id}
                    className="w-full md:w-auto px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {cancelLoading === reg._id ? "Canceling..." : "Cancel Booking"}
                  </button>
                )}
                
                {reg.attendanceStatus === 'Attended' && (
                  <button 
                    onClick={() => handleOpenFeedback(reg.eventId)}
                    className="w-full md:w-auto px-4 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 rounded-lg font-semibold transition-colors"
                  >
                    ⭐ Leave Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedEventForFeedback && (
        <FeedbackModal
          eventId={selectedEventForFeedback._id}
          eventTitle={selectedEventForFeedback.title}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
};

export default MyRegistrations;