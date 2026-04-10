import React from "react";

const events = [
  {
    id: 1,
    title: "Women in Tech Panel Discussion",
    date: "Oct 15, 2026",
    time: "2:00 PM EST",
    location: "Virtual Meeting",
    attendees: 124,
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop",
    tags: ["Panel", "Tech"],
    isRegistered: true,
  },
  {
    id: 2,
    title: "Implicit Bias Workshop",
    date: "Oct 22, 2026",
    time: "10:00 AM EST",
    location: "Main Campus Auditorium",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop",
    tags: ["Workshop", "Interactive"],
    isRegistered: false,
  },
  {
    id: 3,
    title: "Global Diversity Networking Mixer",
    date: "Nov 05, 2026",
    time: "6:00 PM EST",
    location: "Downtown Event Center",
    attendees: 300,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    tags: ["Networking", "Social"],
    isRegistered: false,
  }
];

const StudentEvents = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-neutral-900 overflow-hidden shadow-2xl h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] opacity-30 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-sm font-bold tracking-widest backdrop-blur-md border border-white/30 uppercase mb-4 shadow-sm">
            Community & Networking
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md">
            Upcoming Events
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto drop-shadow-sm font-medium">
            Connect, learn, and grow with a vibrant community. Don't miss out on these exclusive opportunities.
          </p>
        </div>
      </div>

      {/* Filter and Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-4 tracking-wide uppercase text-sm">Categories</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 border-stone-300" defaultChecked />
                <span className="text-stone-600 group-hover:text-stone-900 font-medium transition-colors">Workshops</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 border-stone-300" defaultChecked />
                <span className="text-stone-600 group-hover:text-stone-900 font-medium transition-colors">Panels</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 border-stone-300" />
                <span className="text-stone-600 group-hover:text-stone-900 font-medium transition-colors">Networking</span>
              </label>
            </div>
            
            <hr className="my-6 border-stone-100" />
            
            <h3 className="font-bold text-stone-900 mb-4 tracking-wide uppercase text-sm">Location</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 border-stone-300" defaultChecked />
                <span className="text-stone-600 group-hover:text-stone-900 font-medium transition-colors">Virtual</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 border-stone-300" defaultChecked />
                <span className="text-stone-600 group-hover:text-stone-900 font-medium transition-colors">In-Person</span>
              </label>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="flex-1 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
              <div className="w-full md:w-72 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {event.isRegistered && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Registered ✓
                  </div>
                )}
              </div>
              
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.tags.map(tag => (
                    <span key={tag} className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4 group-hover:text-violet-700 transition-colors">
                  {event.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-stone-600 font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗓️</span> {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span> {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span> {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span> {event.attendees} Attending
                  </div>
                </div>
                
                <div className="mt-auto">
                  {event.isRegistered ? (
                    <button className="px-6 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors border border-stone-200 hover:border-rose-200">
                      Cancel Registration
                    </button>
                  ) : (
                    <button className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-md transition-colors">
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentEvents;
