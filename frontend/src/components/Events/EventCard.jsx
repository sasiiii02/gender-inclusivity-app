import React from 'react';

const EventCard = ({ event, userRole, onAction }) => {
  // Determine the status badge color based on event type or computed status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Workshop': return 'bg-purple-100 text-purple-800';
      case 'Seminar': return 'bg-blue-100 text-blue-800';
      case 'Webinar': return 'bg-indigo-100 text-indigo-800';
      case 'Training': return 'bg-green-100 text-green-800';
      case 'Meetup': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Use eventType as the status display, or derive a status from dates
  const displayStatus = event.status || event.eventType || 'Upcoming';
  
  // Use eventDate (backend field) and fallback to date
  const eventDate = event.eventDate || event.date;
  
  // Display text for the description area (since description is not allowed, use eventType or speaker)
  const descriptionText = event.description || event.eventType || 'Event details';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(displayStatus)}`}>
          {displayStatus}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{descriptionText}</p>
      
      <div className="space-y-2 text-sm text-gray-500 mb-6 border-t pt-4">
        <div className="flex items-center">
          <span className="mr-2">📅</span> {eventDate ? new Date(eventDate).toLocaleDateString() : 'Date TBA'}
        </div>
        <div className="flex items-center">
          <span className="mr-2">📍</span> {event.location || 'Location TBA'}
        </div>
        {event.speaker && (
          <div className="flex items-center">
            <span className="mr-2">🎤</span> {event.speaker}
          </div>
        )}
        <div className="flex items-center">
          <span className="mr-2">👥</span> {event.currentRegistrations || 0} / {event.capacity || '∞'} registered
        </div>
      </div>

      {/* Role-Based Conditional Rendering */}
      <div className="mt-auto">
        {userRole === 'student' && (
          <button 
            onClick={() => onAction('register', event._id)}
            disabled={event.currentRegistrations >= event.capacity}
            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
              event.currentRegistrations >= event.capacity 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {event.currentRegistrations >= event.capacity ? 'Event Full' : 'Register Now'}
          </button>
        )}

        {userRole === 'teacher' && (
          <button 
            onClick={() => onAction('attendance', event._id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Manage Attendance
          </button>
        )}

        {userRole === 'admin' && (
          <div className="flex gap-2">
             <button onClick={() => onAction('edit', event._id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition-colors">Edit</button>
             <button onClick={() => onAction('delete', event._id)} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg font-semibold transition-colors">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;