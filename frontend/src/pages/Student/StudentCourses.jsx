import React from "react";

const courses = [
  {
    id: 1,
    title: "Understanding Gender Equality",
    instructor: "Dr. Sarah Jenkins",
    progress: 75,
    modules: 12,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
    category: "Diversity",
  },
  {
    id: 2,
    title: "Inclusive Language in Tech",
    instructor: "Prof. Alex Rivera",
    progress: 30,
    modules: 8,
    image: "https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?q=80&w=1000&auto=format&fit=crop",
    category: "Communication",
  },
  {
    id: 3,
    title: "Building Safe Workspaces",
    instructor: "Emma Thompson",
    progress: 0,
    modules: 15,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
    category: "Leadership",
  },
  {
    id: 4,
    title: "Intersectionality 101",
    instructor: "David Chen",
    progress: 100,
    modules: 5,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop",
    category: "Social Studies",
  }
];

const StudentCourses = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-br from-violet-50 to-stone-50 p-8 rounded-3xl border border-violet-100 shadow-sm">
        <div>
          <span className="text-violet-600 font-bold tracking-widest text-sm uppercase mb-2 block">Learning Hub</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            My Enrolled Courses
          </h1>
          <p className="text-stone-500 mt-2 max-w-lg">
            Stay on track with your curriculum. Dive into interactive modules and complete your certifications.
          </p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-stone-100 self-start md:self-end">
          <button className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg text-sm font-semibold">Active</button>
          <button className="px-4 py-2 text-stone-500 hover:text-stone-900 rounded-lg text-sm font-medium transition-colors">Completed</button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                  {course.title}
                </h3>
              </div>
              <p className="text-sm text-stone-500 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px]">👩‍🏫</span>
                {course.instructor} • {course.modules} Modules
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className={course.progress === 100 ? "text-emerald-600" : "text-stone-700"}>
                    {course.progress === 100 ? "Completed" : `${course.progress}% Completed`}
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 mb-6">
                  <div 
                    className={`h-2 rounded-full ${course.progress === 100 ? "bg-emerald-500" : "bg-violet-600"}`} 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                
                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:outline-none ${
                    course.progress === 100 
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-100" 
                    : course.progress === 0
                    ? "bg-stone-900 text-white hover:bg-stone-800 focus:ring-stone-200"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200 focus:ring-violet-100"
                  }`}>
                  {course.progress === 100 ? "Review Course" : course.progress === 0 ? "Start Course" : "Continue Learning"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;
