import React, { useState, useEffect } from 'react';
import { campaignEventsApi } from '../../api/campaignEventsApi';

const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchStats(selectedEventId);
    } else {
      setStats(null);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await campaignEventsApi.getAllEvents();
      setEvents(res.data || res);
    } catch (err) {
      console.error("API Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (eventId) => {
    try {
      setStatsLoading(true);
      const res = await campaignEventsApi.getEventStats(eventId);
      // Backend returns aggregated stats, usually an array with 1 object
      const statsData = res.data || res;
      setStats(Array.isArray(statsData) ? statsData[0] : statsData);
    } catch (err) {
      console.error("API Error fetching stats:", err);
      setStats(null); // No reviews yet
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800">Event Analytics</h1>
        <p className="text-gray-500 mt-2">View real-time aggregated feedback and ratings from attendees.</p>
      </div>

      {/* Event Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select an Event to Analyze:</label>
        <select 
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">-- Choose an Event --</option>
          {events.map(event => (
            <option key={event._id} value={event._id}>{event.title}</option>
          ))}
        </select>
      </div>

      {/* Stats Display */}
      {selectedEventId && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {statsLoading ? (
            <div className="text-center text-gray-500 py-8">Calculating aggregations...</div>
          ) : stats ? (
            <div className="flex flex-col md:flex-row items-center justify-around text-center gap-8">
              
              {/* Aggregation Output 1: Average Rating */}
              <div className="bg-green-50 p-8 rounded-full w-48 h-48 flex flex-col justify-center border-4 border-green-100 shadow-inner">
                <span className="text-5xl font-bold text-green-700 mb-1">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : 0}
                </span>
                <span className="text-sm font-bold text-green-800 tracking-widest uppercase">Avg Rating</span>
                <span className="text-yellow-500 text-xl mt-1">★★★★★</span>
              </div>

              {/* Aggregation Output 2: Total Reviews */}
              <div className="flex flex-col">
                <span className="text-6xl font-black text-gray-800 mb-2">{stats.totalReviews || 0}</span>
                <span className="text-gray-500 font-semibold text-lg uppercase tracking-wider">Total Reviews Submitted</span>
                <p className="text-sm text-gray-400 mt-4 max-w-xs">
                  *These metrics are dynamically calculated using MongoDB's $match and $group aggregation pipelines.
                </p>
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl">📊</span>
              <p className="text-gray-500 mt-4 text-lg font-medium">No feedback has been submitted for this event yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventAnalytics;