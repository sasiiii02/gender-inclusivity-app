import React from 'react';

const EventDetailsModal = ({ event, onClose, onRegister }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors text-2xl"
          >
            &times;
          </button>
          <div className="absolute -bottom-6 left-6">
            <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-indigo-600 shadow-md">
              {event.eventType || 'Event'}
            </span>
          </div>
        </div>

        <div className="p-6 pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-medium">{event.eventDate ? new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-medium">{event.location || 'TBA'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">🎤</span>
              <div>
                <p className="text-xs text-gray-400">Speaker</p>
                <p className="font-medium">{event.speaker || 'TBA'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">👥</span>
              <div>
                <p className="text-xs text-gray-400">Capacity</p>
                <p className="font-medium">{event.registeredCount || 0} / {event.capacity || '∞'} registered</p>
              </div>
            </div>
          </div>

          <div className="my-6">
            <h3 className="font-semibold text-gray-700 mb-2">About this event</h3>
            <p className="text-gray-600 leading-relaxed">
              {event.description || 'Join us for this insightful session on gender inclusivity. Learn practical strategies and connect with like-minded individuals.'}
            </p>
          </div>

          {/* Share & Calendar section */}
          <div className="border-t pt-6 mt-4">
            <p className="text-sm font-medium text-gray-500 mb-3">Share this event</p>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => { onRegister(event._id); onClose(); }}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;