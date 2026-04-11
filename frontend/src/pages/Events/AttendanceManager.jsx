import React, { useState, useEffect, useCallback } from 'react';
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
  const [searchTerm, setSearchTerm] = useState("");

  const extractEvents = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.events)) return payload.events;
    if (Array.isArray(payload?.data?.events)) return payload.data.events;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const fetchEvents = useCallback(async () => {
    try {
      const res = await campaignEventsApi.getAllEvents({ page: 1, limit: 1000 });
      const eventsData = extractEvents(res);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error("API Error fetching events:", err);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Fetch all events so the teacher can select one from a dropdown
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 2. Fetch attendees whenever the teacher selects a new event
  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    } else {
      setAttendees([]);
      setSelectedIds([]);
    }
  }, [selectedEventId]);

  const fetchAttendees = async (eventId) => {
    try {
      setTableLoading(true);
      setSelectedIds([]);
      const res = await campaignEventsApi.getEventAttendees(eventId);
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
      setSelectedIds(filteredAttendees.map(a => a._id));
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
      fetchAttendees(selectedEventId);
    } catch (err) {
      console.error("API Error updating attendance:", err);
      alert(err.response?.data?.message || "Failed to update attendance.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- Stats & Filtering ---
  const totalAttendees = attendees.length;
  const attendedCount = attendees.filter(a => a.attendanceStatus === 'Attended').length;
  const absentCount = attendees.filter(a => a.attendanceStatus === 'Absent').length;
  const attendanceRate = totalAttendees > 0 ? Math.round((attendedCount / totalAttendees) * 100) : 0;

  const filteredAttendees = attendees.filter(attendee => {
    const name = attendee.userId?.name?.toLowerCase() || '';
    const email = attendee.userId?.email?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  // --- Export to CSV ---
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Registration Date', 'Status'];
    const rows = filteredAttendees.map(a => [
      a.userId?.name || 'Unknown',
      a.userId?.email || '',
      new Date(a.registrationDate).toLocaleDateString(),
      a.attendanceStatus || 'Registered'
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedEventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        {events.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">No events found. Create an event first from the Admin Events page.</p>
        )}
      </div>

      {/* The Data Table */}
      {selectedEventId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 border-b">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-gray-800">{totalAttendees}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-green-600 uppercase tracking-wider">Attended</p>
              <p className="text-2xl font-bold text-green-700">{attendedCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-red-500 uppercase tracking-wider">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-blue-500 uppercase tracking-wider">Rate</p>
              <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-sm font-semibold text-gray-600">
              {selectedIds.length} Students Selected
            </span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Export CSV Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                📥 Export CSV
              </button>
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
          </div>

          {/* Table */}
          {tableLoading ? (
            <div className="p-12 text-center text-gray-500">Loading attendees...</div>
          ) : filteredAttendees.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm ? 'No students match your search.' : 'No students have registered for this event yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b text-sm text-gray-500">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedIds.length === filteredAttendees.length && filteredAttendees.length > 0}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                    </th>
                    <th className="p-4 font-semibold">Student Details</th>
                    <th className="p-4 font-semibold">Registration Date</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAttendees.map(reg => (
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