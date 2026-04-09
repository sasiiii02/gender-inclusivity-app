import React from "react";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-violet-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-violet-800/80 to-transparent"></div>
        <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-violet-500/30 text-violet-100 text-xs font-bold tracking-wider mb-6 backdrop-blur-md border border-violet-400/30 uppercase">
            Welcome to InclusiveSpace
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Empower your learning journey today.
          </h1>
          <p className="text-violet-100 text-lg mb-8 max-w-xl leading-relaxed">
            Discover tailored courses, test your knowledge, and connect with a supportive community designed for your success.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/student/courses")}
              className="px-6 py-3 rounded-xl bg-white text-violet-900 font-bold hover:bg-stone-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Courses
            </button>
            <button 
              onClick={() => navigate("/student/dashboard")}
              className="px-6 py-3 rounded-xl bg-violet-800 text-white font-bold hover:bg-violet-700 border border-violet-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Take a Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group bg-white rounded-3xl p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:border-violet-100 transition-all duration-300 cursor-pointer" onClick={() => navigate("/student/courses")}>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            📚
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">My Courses</h3>
          <p className="text-stone-500 leading-relaxed">Resume your learning where you left off. Access high-quality educational materials instantly.</p>
        </div>

        {/* Card 2 */}
        <div className="group bg-white rounded-3xl p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:border-violet-100 transition-all duration-300 cursor-pointer" onClick={() => navigate("/student/events")}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
            📅
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Upcoming Events</h3>
          <p className="text-stone-500 leading-relaxed">Join live workshops, webinars, and community gatherings designed for inclusivity.</p>
        </div>

        {/* Card 3 */}
        <div className="group bg-white rounded-3xl p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:border-violet-100 transition-all duration-300 cursor-pointer" onClick={() => navigate("/student/support")}>
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            🛟
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Support Center</h3>
          <p className="text-stone-500 leading-relaxed">Need help? Connect with counselors or browse helpful articles to guide you.</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold text-stone-900">Your Learning Progress</h2>
          <span className="text-violet-600 font-semibold cursor-pointer hover:underline text-sm">View details</span>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-stone-700">Digital Literacy Fundamentals</span>
              <span className="text-violet-600">75%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5">
              <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-stone-700">Inclusive Communication</span>
              <span className="text-violet-600">40%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5">
              <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: "40%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-stone-700">Leadership Workshop Module</span>
              <span className="text-emerald-500">Completed! ✨</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
