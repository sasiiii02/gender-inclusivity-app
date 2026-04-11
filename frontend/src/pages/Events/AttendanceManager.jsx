import React, { useState, useEffect } from 'react';
import { campaignEventsApi } from '../../api/campaignEventsApi';

const AttendanceManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  
  const [attendees, setAttendees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch all events so the teacher can select one from a dropdown
  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Fetch attendees whenever the teacher selects a new event
  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    } else {
      setAttendees([]);
      setSelectedIds([]);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
  try {
    const res = await campaignEventsApi.getAllEvents();
    
    let events = [];
    if (res?.data?.events) {
      events = res.data.events;
    } else if (res?.data && Array.isArray(res.data)) {
      events = res.data;
    } else if (Array.isArray(res)) {
      events = res;
    } else if (res?.events) {
      events = res.events;
    }
    
    setEvents(events);
  } catch (err) {
    console.error("API Error fetching events:", err);
    setError("Failed to load events.");
  } finally {
    setLoading(false);
  }
};

  const fetchAttendees = async (eventId) => {
    try {
      setTableLoading(true);
      setSelectedIds([]); 
      const res = await campaignEventsApi.getEventAttendees(eventId);
      
      // CRASH-PROOFING
      let data = res.data?.data || res.data || res;
      setAttendees(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("API Error fetching attendees:", err);
      setError("Failed to load attendees for this event.");
    } finally {
      setTableLoading(false);
    }
  };

  // --- CHECKBOX STATE MANAGEMENT ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select everyone who hasn't been marked yet
      setSelectedIds(attendees.map(a => a._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- THE BULK API CALL ---
  const handleBulkAction = async (status) => {
    if (selectedIds.length === 0) return alert("Please select at least one student.");
    
    try {
      setActionLoading(true);
      await campaignEventsApi.bulkMarkAttendance(selectedIds, status);
      
      alert(`Successfully marked ${selectedIds.length} students as ${status}!`);
      // Refresh the table to show the new statuses
      fetchAttendees(selectedEventId);
    } catch (err) {
      console.error("API Error updating attendance:", err);
      alert(err.response?.data?.message || "Failed to update attendance.");
    } finally {
      setActionLoading(false);
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
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800">Attendance Manager</h1>
        <p className="text-gray-500 mt-2">Bulk manage student attendance for your events.</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg">⚠️ {error}</div>}

      {/* Event Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select an Event to Manage:</label>
        <select 
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">-- Choose an Event --</option>
          {events.map(event => (
            <option key={event._id} value={event._id}>
              {event.title} ({event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'No Date'})
            </option>
          ))}
        </select>
      </div>

      {/* The Data Table */}
      {selectedEventId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Action Bar */}
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">
              {selectedIds.length} Students Selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('Absent')}
                disabled={selectedIds.length === 0 || actionLoading}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Mark Absent
              </button>
              <button 
                onClick={() => handleBulkAction('Attended')}
                disabled={selectedIds.length === 0 || actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Updating..." : "Mark Attended"}
              </button>
            </div>
          </div>

          {/* Table */}
          {tableLoading ? (
             <div className="p-12 text-center text-gray-500">Loading attendees...</div>
          ) : attendees.length === 0 ? (
             <div className="p-12 text-center text-gray-500">No students have registered for this event yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b text-sm text-gray-500">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedIds.length === attendees.length && attendees.length > 0}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                    </th>
                    <th className="p-4 font-semibold">Student Details</th>
                    <th className="p-4 font-semibold">Registration Date</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendees.map(reg => (
                    <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(reg._id)}
                          onChange={() => handleSelectOne(reg._id)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                      </td>
                      <td className="p-4">
                        {/* Assumes backend populates userId with name and email */}
                        <p className="font-semibold text-gray-800">{reg.userId?.name || "Unknown Student"}</p>
                        <p className="text-xs text-gray-500">{reg.userId?.email || "No email provided"}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          reg.attendanceStatus === 'Attended' ? 'bg-green-100 text-green-800' : 
                          reg.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.attendanceStatus || 'Registered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;