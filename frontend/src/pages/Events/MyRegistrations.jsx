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
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

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

  // --- Computed values for tabs & stats ---
  const now = new Date();
  const upcomingRegistrations = registrations.filter(reg => 
    reg.eventId?.eventDate && new Date(reg.eventId.eventDate) >= now
  );
  const pastRegistrations = registrations.filter(reg => 
    reg.eventId?.eventDate && new Date(reg.eventId.eventDate) < now
  );
  const displayedRegistrations = activeTab === 'upcoming' ? upcomingRegistrations : pastRegistrations;

  const totalEvents = registrations.length;
  const attendedCount = registrations.filter(r => r.attendanceStatus === 'Attended').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 opacity-30 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left animate-fade-in-up pt-4 sm:pt-6">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent tracking-tight leading-tight pb-2">
            My Registrations
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl">
            Manage your upcoming gender inclusivity training sessions and track your participation.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4"></div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-xl shadow-sm animate-shake">
            <p className="flex items-center gap-2">
              <span className="text-xl">⚠️</span> {error}
            </p>
          </div>
        )}

        {registrations.length === 0 && !error ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-12 text-center transform transition-all hover:scale-[1.02] duration-500 animate-fade-in-up">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
              <div className="relative text-7xl mb-6 animate-float">📅</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No Upcoming Events</h2>
            <p className="text-gray-600 mb-8 text-lg">You haven't registered for any events yet. Discover amazing sessions!</p>
            <button
              onClick={() => navigate('/student/events')}
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-semibold text-white rounded-2xl shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                Browse Events
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-gray-200 pb-2 mb-6 animate-fade-in-up">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📅 Upcoming ({upcomingRegistrations.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ✅ Past Events ({pastRegistrations.length})
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                <p className="text-xs text-indigo-600 uppercase tracking-wider">Total Events</p>
                <p className="text-2xl font-bold text-indigo-800">{totalEvents}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-sm">
                <p className="text-xs text-green-600 uppercase tracking-wider">Attended</p>
                <p className="text-2xl font-bold text-green-800">{attendedCount}</p>
              </div>
            </div>

            {/* Registrations List */}
            <div className="space-y-6">
              {displayedRegistrations.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 p-12 text-center animate-fade-in-up">
                  <p className="text-gray-500 text-lg">
                    {activeTab === 'upcoming' ? 'No upcoming events. Browse and register for new sessions!' : 'No past events yet.'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => navigate('/student/events')}
                      className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors"
                    >
                      Browse Events
                    </button>
                  )}
                </div>
              ) : (
                displayedRegistrations.map((reg, index) => (
                  <div
                    key={reg._id}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:border-indigo-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                            <span className="text-white text-xl">📌</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                              {reg.eventId?.title || "Event Details Unavailable"}
                            </h3>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                <span>🗓️</span>
                                {reg.eventId?.eventDate ? new Date(reg.eventId.eventDate).toLocaleDateString(undefined, { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                }) : "Date TBD"}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                                <span>📍</span>
                                {reg.eventId?.location || "Location TBD"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-13 mt-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                reg.attendanceStatus === 'Attended' ? 'bg-emerald-500' : 
                                reg.attendanceStatus === 'Cancelled' ? 'bg-rose-500' : 
                                'bg-amber-500'
                              } animate-pulse`}></div>
                              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                Status: <span className={`${
                                  reg.attendanceStatus === 'Attended' ? 'text-emerald-600' : 
                                  reg.attendanceStatus === 'Cancelled' ? 'text-rose-600' : 
                                  'text-amber-600'
                                }`}>{reg.attendanceStatus || "Registered"}</span>
                              </span>
                            </div>
                            {reg.eventId?.speaker && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <span>🎤</span>
                                <span className="text-sm">{reg.eventId.speaker}</span>
                              </div>
                            )}
                          </div>
                          {/* Certificate placeholder */}
                          {reg.attendanceStatus === 'Attended' && (
                            <div className="mt-3">
                              <button
                                onClick={() => alert('Certificate feature coming soon!')}
                                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Certificate
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row lg:flex-col items-center justify-end gap-3">
                        {reg.attendanceStatus !== 'Attended' && (
                          <button
                            onClick={() => handleCancel(reg._id)}
                            disabled={cancelLoading === reg._id}
                            className="group relative w-full sm:w-auto px-6 py-3 overflow-hidden rounded-2xl bg-white border-2 border-rose-200 text-rose-600 hover:text-white font-semibold transition-all duration-300 hover:bg-rose-500 hover:border-rose-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="relative flex items-center justify-center gap-2">
                              {cancelLoading === reg._id ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Canceling...
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel Booking
                                </>
                              )}
                            </span>
                          </button>
                        )}

                        {reg.attendanceStatus === 'Attended' && (
                          <button
                            onClick={() => handleOpenFeedback(reg.eventId)}
                            className="group relative w-full sm:w-auto px-6 py-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-orange-600"
                          >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300 to-amber-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-center gap-2">
                              <span className="text-xl">⭐</span>
                              Leave Feedback
                              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedEventForFeedback && (
        <FeedbackModal
          eventId={selectedEventForFeedback._id}
          eventTitle={selectedEventForFeedback.title}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={handleFeedbackSuccess}
        />
      )}

      {/* Animations - add to index.css if not already present */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .ml-13 {
          margin-left: 3.25rem;
        }
      `}</style>
    </div>
  );
};

export default MyRegistrations;