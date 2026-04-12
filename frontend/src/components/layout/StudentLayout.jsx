import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { LogOut, User, Settings } from "lucide-react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
              <div className="relative pl-4 border-l border-stone-100" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-black text-stone-900 leading-none group-hover:text-violet-600 transition-colors">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-stone-400 font-bold mt-1 uppercase tracking-tighter">
                      {user.role}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-100 to-indigo-50 border border-violet-200 flex items-center justify-center text-violet-700 font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
                    {user.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden animate-fade-in">
                    {/* Identity card */}
                    <div className="p-4 bg-stone-50 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-stone-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[9px] font-black uppercase tracking-widest">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="p-2">
                      <Link
                        to="/student/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 text-stone-600 hover:text-violet-700 transition-colors group"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-semibold">Edit Profile</span>
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
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