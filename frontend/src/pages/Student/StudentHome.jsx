import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  LifeBuoy, 
  PlusCircle, 
  Trophy, 
  ShieldAlert,
  Clock,
  CheckCircle2
} from "lucide-react";

const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ── Hero / Greeting ── */}
      <div className="relative rounded-[2.5rem] bg-stone-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] opacity-15 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-950 via-violet-900/40 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-12 lg:p-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 text-violet-200 text-[10px] font-black tracking-widest uppercase backdrop-blur-md border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                Student Portal Active
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white mb-6 leading-[1.1]">
                {getGreeting()}, <br />
                <span className="text-violet-300">{user?.name?.split(' ')[0]}</span>.
              </h1>
              <p className="text-violet-100/70 text-lg mb-8 leading-relaxed font-medium">
                Your journey towards a more inclusive world continues here. Track your progress or start something new today.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("/student/courses")}
                  className="px-8 py-4 rounded-2xl bg-white text-violet-950 font-black text-sm hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                >
                  Explore Learning <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate("/student/reports")}
                  className="px-8 py-4 rounded-2xl bg-violet-800/50 backdrop-blur-md text-white font-black text-sm hover:bg-violet-800/80 border border-violet-700/50 transition-all shadow-xl flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Submit Report
                </button>
              </div>
            </div>
            
            {/* Quick Stats Widget (Overlay) */}
            <div className="hidden lg:block w-72 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xs font-black text-violet-200 uppercase tracking-widest mb-6 px-1">Weekly Pulse</h3>
              <div className="space-y-6">
                {[
                  { label: "Course Minutes", value: "124m", icon: <Clock className="w-4 h-4" />, color: "bg-amber-400" },
                  { label: "Points Earned", value: "850", icon: <Trophy className="w-4 h-4" />, color: "bg-emerald-400" },
                  { label: "Rank", value: "Top 15%", icon: <ArrowRight className="w-4 h-4" />, color: "bg-violet-400" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center text-stone-900 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-violet-200/60 font-bold uppercase tracking-tighter">{stat.label}</p>
                      <p className="text-white font-black">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Main Area ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              onClick={() => navigate("/student/courses")}
              className="group bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 hover:shadow-2xl hover:border-violet-100 transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-violet-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-black text-stone-900 mb-2">My Learning</h3>
                <p className="text-stone-400 font-medium text-sm leading-relaxed mb-6">
                  Access your course library and resume your latest modules.
                </p>
                <span className="inline-flex items-center gap-2 text-violet-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Access Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div 
              onClick={() => navigate("/student/events")}
              className="group bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 hover:shadow-2xl hover:border-violet-100 transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-black text-stone-900 mb-2">Events Hub</h3>
                <p className="text-stone-400 font-medium text-sm leading-relaxed mb-6">
                  Browse and register for upcoming community meetups and webinars.
                </p>
                <span className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  View Calendar <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-2xl font-black text-stone-900 mb-1">Learning Journey</h2>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Your current active courses</p>
              </div>
              <button 
                onClick={() => navigate("/student/dashboard")}
                className="w-10 h-10 rounded-xl bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-violet-600 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-8">
              {[
                { name: "Inclusive Communication", progress: 65, color: "bg-violet-600" },
                { name: "Gender Identity & Beyond", progress: 40, color: "bg-indigo-500" },
                { name: "Supportive Leadership", progress: 100, color: "bg-emerald-500" },
              ].map((course) => (
                <div key={course.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-3 px-1">
                    <span className="text-sm font-black text-stone-700 group-hover:text-violet-600 transition-colors uppercase tracking-tight font-serif">{course.name}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${course.progress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-50 border border-stone-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`${course.color} h-full rounded-full transition-all duration-1000 shadow-sm`} 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar Area ── */}
        <div className="space-y-8">
          
          {/* Safety & Integrity Widget */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700">
              <ShieldAlert className="w-24 h-24 text-stone-900" />
            </div>
            
            <h3 className="text-xs font-black text-violet-600 uppercase tracking-widest mb-6 px-1">Safety First</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 italic font-serif">
                <p className="text-sm text-stone-600 leading-relaxed">
                  "Your voice is the foundation of our community. We protect your identity and ensure every report is handled with the highest integrity."
                </p>
              </div>
              
              <div className="space-y-4 px-1">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-tight">100% Anonymous Submissions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-tight">End-to-End Encryption</p>
                </div>
              </div>

              <button 
                onClick={() => navigate("/student/reports")}
                className="w-full py-4 rounded-xl bg-stone-900 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-xl shadow-stone-200"
              >
                Report Securely
              </button>
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] p-8 shadow-xl shadow-violet-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-700">
              <LifeBuoy className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-serif text-2xl font-black mb-2">Need Help?</h3>
              <p className="text-violet-100/70 text-sm font-medium mb-8 leading-relaxed">
                Connect with our peer counselors or browse safe-space guidelines.
              </p>
              <button 
                onClick={() => navigate("/student/support")}
                className="w-full py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-violet-700 transition-all shadow-lg shadow-violet-900/20"
              >
                Get Support Now
              </button>
            </div>
          </div>

          {/* User Score/Level Card (Optional Aesthetic) */}
          <div className="bg-amber-50 rounded-[2rem] p-6 text-center border border-amber-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm text-amber-500 mb-4 animate-bounce">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Community Level</h4>
            <p className="text-xl font-black text-stone-800">Advocate Phase 1</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentHome;

