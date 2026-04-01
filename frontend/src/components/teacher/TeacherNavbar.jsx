import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/teacher/dashboard": "Dashboard",
  "/teacher/quizzes": "My Quizzes",
  "/teacher/quiz/new": "Create New Quiz",
  "/teacher/questions": "Question Bank",
  "/teacher/results": "Quiz Results",
  "/teacher/live": "Live Sessions",
};

const TeacherNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page title
  let title = pageTitles[location.pathname] || "Teacher Portal";

  // Handle dynamic titles
  if (location.pathname.match(/\/teacher\/quiz\/[^/]+\/edit/)) {
    title = "Edit Quiz";
  }
  if (location.pathname.match(/\/teacher\/quiz\/[^/]+\/questions/)) {
    title = "Manage Questions";
  }
  if (location.pathname.match(/\/teacher\/quiz\/[^/]+\/config/)) {
    title = "Quiz Settings";
  }
  if (location.pathname.match(/\/teacher\/quiz\/[^/]+\/preview/)) {
    title = "Quiz Preview";
  }
  if (location.pathname.match(/\/teacher\/quiz\/[^/]+\/live/)) {
    title = "Live Quiz Session";
  }

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-10 shadow-sm">
      {/* Hamburger Menu - Mobile Only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-zinc-100 transition-colors"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* New Quiz Button */}
        <button
          onClick={() => navigate("/teacher/quiz/new")}
          className="hidden sm:flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Quiz
        </button>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-zinc-100 text-zinc-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9-5.197V8.5m.002 3.5L12 15l-3.5-3.5"
            />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-semibold text-base shadow-sm">
              {user.name?.charAt(0) || "T"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-zinc-900 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-zinc-500">Teacher</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TeacherNavbar;
