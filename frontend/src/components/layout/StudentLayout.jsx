import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { name: "Home", path: "/student/home" },
  { name: "Courses", path: "/student/courses" },
  { name: "Support", path: "/student/support" },
  { name: "Reports", path: "/student/reports" },
  { name: "Quiz", path: "/student/dashboard" }, // Quiz links to existing /student/dashboard
  { name: "Events", path: "/student/events" },
  { name: "My Registrations", path: "/my-registrations" }, // <-- Your custom route added here!
];

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200"
          : "bg-white border-b border-stone-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white text-xl">🌈</span>
            </div>
            <div>
              <span className="font-serif font-black text-lg text-stone-900 tracking-tight leading-none block">
                InclusiveSpace
              </span>
              <span className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase mt-0.5 block">
                Student
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-100 text-violet-700 shadow-sm"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-stone-100">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-black text-stone-900 leading-none">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-stone-400 font-bold mt-1.5 uppercase tracking-tighter">
                    {user.role} Account
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stone-100 to-white border border-stone-200 flex items-center justify-center text-stone-600 font-black text-xs shadow-sm cursor-pointer hover:border-stone-300 transition-all">
                  {user.name?.charAt(0) || "S"}
                </div>
                <button
                  onClick={logout}
                  className="w-9 h-9 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-all duration-300 flex items-center justify-center group"
                  title="Secure Logout"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation (Bottom Bar or Hamburger can be added here if needed) */}
      <div className="md:hidden flex overflow-x-auto border-t border-stone-100 bg-stone-50/50 px-2 py-2 hide-scrollbar">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium mx-1 transition-colors ${
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-stone-600"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </header>
  );
};

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans">
      <StudentNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;