import React from 'react';

const QRCodeModal = ({ event, registrationId, studentName, onClose }) => {
  // Build the ticket data string
  const ticketData = JSON.stringify({
    event: event.title,
    date: event.eventDate,
    location: event.location,
    registrationId,
    student: studentName,
  });

  // QR Server API URL (free, no API key required)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketData)}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `ticket-${event.title.replace(/\s+/g, '-')}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎟️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Registration Successful!</h2>
          <p className="text-gray-500 text-sm mb-4">Your ticket is ready</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-dashed border-indigo-200 mb-4">
          <div className="text-center mb-4">
            <p className="text-xs text-indigo-600 uppercase tracking-wider">Event Ticket</p>
            <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
            <p className="text-sm text-gray-600">
              {event.eventDate ? new Date(event.eventDate).toLocaleString() : 'Date TBA'}
            </p>
            <p className="text-sm text-gray-600">{event.location}</p>
          </div>

          {/* QR Code Image */}
          <div className="bg-white p-3 rounded-xl shadow-inner flex justify-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code Ticket" 
              className="w-48 h-48"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=QR+Code+Error'; }}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Attendee: {studentName}</p>
            <p className="text-xs text-gray-400 font-mono mt-1">Ref: {registrationId?.slice(-8)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Ticket
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;