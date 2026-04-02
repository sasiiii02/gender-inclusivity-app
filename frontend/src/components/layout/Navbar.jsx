import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/learning":  "Learning Materials",
  "/quiz":      "Quiz & Assessments",
  "/events":    "Events & Campaigns",
  "/reports":   "Incident Reports",
  "/support":   "Support Center",
  "/chat":      "AI Chatbot",
  "/student/courses": "Courses",
  "/student/enrollments": "My Enrollments",
  "/teacher/manage-courses": "Manage Courses",
  "/admin":     "Admin Panel",
};

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const title =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([key]) =>
      location.pathname.startsWith(key)
    )?.[1] ||
    "InclusiveSpace";

  return (
    <header className="h-16 bg-white border-b border-stone-100 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10 shadow-[0_1px_0_0_#e7e5e4]">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-stone-100 transition-colors"
        aria-label="Open menu"
      >
        <span className="w-5 h-0.5 bg-stone-600 rounded" />
        <span className="w-5 h-0.5 bg-stone-600 rounded" />
        <span className="w-3 h-0.5 bg-stone-600 rounded" />
      </button>

      {/* Page title */}
      <h1 className="font-serif text-xl font-bold text-stone-900 flex-1">
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-violet-700 flex items-center justify-center text-white font-serif font-bold text-sm uppercase">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-stone-800 leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-stone-400 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;