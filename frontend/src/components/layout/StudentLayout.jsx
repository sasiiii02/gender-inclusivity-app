import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", path: "/student/home" },
  { name: "Courses", path: "/student/courses" },
  { name: "Support", path: "/student/support" },
  { name: "Quiz", path: "/student/dashboard" },
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
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200"
          : "bg-white border-b border-stone-100"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <span className="text-white text-xl">✨</span>
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-stone-900 leading-none block">
                InclusiveSpace
              </span>
              <span className="text-[10px] text-stone-500 font-semibold tracking-widest uppercase">
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
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
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
            <button className="relative w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-500">
              🔔
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold text-stone-800 leading-none">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium mt-1 uppercase">
                    {user.role}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-800 to-stone-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-all">
                  {user.name?.charAt(0) || "S"}
                </div>
                <button
                  onClick={logout}
                  className="ml-2 text-stone-400 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
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
              `flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium mx-1 transition-colors ${isActive
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