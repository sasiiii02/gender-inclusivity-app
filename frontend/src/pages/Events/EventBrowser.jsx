import React, { useState, useEffect } from 'react';
import { campaignEventsApi } from '../../api/campaignEventsApi';
import EventCard from '../../components/Events/EventCard';

const EventBrowser = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // In a real app, this comes from your AuthContext. We hardcode 'student' for testing.
  const userRole = 'student'; 

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await campaignEventsApi.getAllEvents();
      setEvents(res.data || res);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (actionType, eventId) => {
    if (actionType === 'register') {
      try {
        setActionLoading(true);
        // We pass empty accessibility needs for now, can add a modal for this later!
        await campaignEventsApi.registerForEvent(eventId, "None"); 
        
        alert("Registration Successful! Please check your email (SendGrid) for confirmation.");
        fetchEvents(); // Refresh to update the capacity numbers
        
      } catch (err) {
        console.error("Registration error:", err);
        alert(err.response?.data?.message || "Failed to register. You might already be registered.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
        <p className="text-gray-500 mt-2">Browse and register for gender inclusivity training and workshops.</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 && !error ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No events are currently scheduled. Check back soon!</p>
          </div>
        ) : (
          events.map((event) => (
             <EventCard 
               key={event._id} 
               event={event} 
               userRole={userRole} 
               onAction={handleCardAction} 
             />
          ))
        )}
      </div>

      {/* Loading overlay for when the user clicks Register */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
           <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <p className="font-semibold text-gray-700">Processing Registration...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default EventBrowser;