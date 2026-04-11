import React, { useState, useEffect, useMemo } from 'react';
import { campaignEventsApi } from '../../api/campaignEventsApi';
import EventCard from '../../components/Events/EventCard';
import EventDetailsModal from '../../components/Events/EventDetailsModal';
import QuoteWidget from '../../components/Events/QuoteWidget';
import QRCodeModal from '../../components/Events/QRCodeModal';

const EventBrowser = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState("grid");
  const [weatherData, setWeatherData] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);

  const userRole = 'student';

  useEffect(() => {
    fetchEvents();
  }, []);

  const extractEvents = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.events)) return payload.events;
    if (Array.isArray(payload?.data?.events)) return payload.data.events;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await campaignEventsApi.getAllEvents({ page: 1, limit: 1000 });
      const events = extractEvents(res);
      setEvents(Array.isArray(events) ? events : []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (actionType, eventIdOrEvent) => {
    if (actionType === 'register') {
      try {
        setActionLoading(true);
        const res = await campaignEventsApi.registerForEvent(eventIdOrEvent, "None");
        const registeredEvent = events.find(e => e._id === eventIdOrEvent);
        setRegistrationResult({
          event: registeredEvent,
          registrationId: res.data?._id || res._id || 'REG-' + Date.now(),
        });
        setShowQRModal(true);
        fetchEvents();
      } catch (err) {
        console.error("Registration error:", err);
        alert(err.response?.data?.message || "Failed to register. You might already be registered.");
      } finally {
        setActionLoading(false);
      }
    } else if (actionType === 'details') {
      setSelectedEvent(eventIdOrEvent);
      setShowDetailsModal(true);
    }
  };

  const fetchWeatherForEvent = async (event) => {
    if (!event?.location) return;
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!apiKey) {
        alert("Weather API key not configured.");
        return;
      }
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(event.location)}&appid=${apiKey}&units=metric`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData({ event, weather: data });
        setShowWeather(true);
      } else {
        alert("Weather data not available.");
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.speaker?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType !== "All") {
      filtered = filtered.filter(event => event.eventType === selectedType);
    }
    return filtered;
  }, [events, searchTerm, selectedType]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const eventTypes = useMemo(() => {
    const types = [...new Set(events.map(e => e.eventType).filter(Boolean))];
    return ["All", ...types.sort()];
  }, [events]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent tracking-tight pb-2">
            Upcoming Events
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl">
            Browse and register for gender inclusivity training and workshops.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4"></div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="flex rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 ${viewMode === "grid" ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 ${viewMode === "list" ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        {events.length > 0 && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <button
              onClick={() => fetchWeatherForEvent(events[0])}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-indigo-200"
            >
              <span>🌤️</span> Check weather for {events[0]?.location || "first event"}
            </button>
          </div>
        )}

        {/* Quote Widget */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <QuoteWidget />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-xl shadow-sm animate-shake">
            <p className="flex items-center gap-2"><span>⚠️</span> {error}</p>
          </div>
        )}

        {/* Events Grid/List */}
        {filteredEvents.length === 0 && !error ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-12 text-center transform transition-all hover:scale-[1.02] duration-500 animate-fade-in-up">
            <div className="text-7xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No events found</h2>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedType("All"); }}
              className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-2xl font-semibold hover:bg-indigo-200 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {currentEvents.map((event, index) => (
                <div
                  key={event._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <EventCard
                    event={event}
                    userRole={userRole}
                    onAction={handleCardAction}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-2 animate-fade-in-up">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Weather Modal */}
      {showWeather && weatherData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Weather in {weatherData.event.location}</h3>
              <button onClick={() => setShowWeather(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="text-center py-4">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mx-auto w-20 h-20"
              />
              <p className="text-3xl font-bold text-gray-800">{Math.round(weatherData.weather.main.temp)}°C</p>
              <p className="text-gray-600 capitalize">{weatherData.weather.weather[0].description}</p>
              <p className="text-sm text-gray-500 mt-2">Humidity: {weatherData.weather.main.humidity}% | Wind: {weatherData.weather.wind.speed} m/s</p>
            </div>
            <button
              onClick={() => setShowWeather(false)}
              className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <p className="font-semibold text-gray-700">Processing Registration...</p>
          </div>
        </div>
      )}

      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetailsModal(false)}
          onRegister={(eventId) => handleCardAction('register', eventId)}
        />
      )}

      {showQRModal && registrationResult && (
        <QRCodeModal
          event={registrationResult.event}
          registrationId={registrationResult.registrationId}
          studentName={JSON.parse(localStorage.getItem('user'))?.name || 'Attendee'}
          onClose={() => {
            setShowQRModal(false);
            setRegistrationResult(null);
          }}
        />
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default EventBrowser;