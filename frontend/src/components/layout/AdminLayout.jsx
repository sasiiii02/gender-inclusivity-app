import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const adminNav = [
  { label: "Dashboard",  icon: "🏠", path: "/admin" },
  { label: "Users",      icon: "👥", path: "/admin/users" },
  { label: "Reports",    icon: "🚨", path: "/admin/reports" },
  { label: "Learning",   icon: "📚", path: "/admin/learning" },
  { label: "Quiz",       icon: "📝", path: "/admin/quiz" },
  { label: "Events",     icon: "📅", path: "/admin/events" },
  { label: "Attendance", icon: "✅", path: "/admin/attendance" }, // <-- Added your feature
  { label: "Analytics",  icon: "📊", path: "/admin/analytics" },  // <-- Added your feature
  { label: "Support",    icon: "🛟", path: "/admin/support" },
];

const pageTitles = {
  "/admin":          "Dashboard",
  "/admin/users":    "User Management",
  "/admin/reports":  "Incident Reports",
  "/admin/learning": "Learning Materials",
  "/admin/quiz":     "Quiz Management",
  "/admin/events":   "Events & Campaigns",
  "/admin/attendance": "Attendance Management", // <-- Added
  "/admin/analytics":  "Event Analytics",       // <-- Added
  "/admin/support":  "Support Articles",
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-stone-900 z-30 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-700">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-base">🌈</div>
          <div>
            <p className="font-serif font-bold text-white text-sm leading-tight">InclusiveSpace</p>
            
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-stone-400 hover:text-white text-xl">×</button>
        </div>

        {/* User pill */}
        {user && (
          <div className="mx-3 mt-4 px-3 py-2.5 rounded-xl bg-stone-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold uppercase">
              {user.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-wide">Administrator</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-stone-500 uppercase tracking-widest mb-2">Management</p>
          {adminNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-stone-400 hover:bg-stone-800 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Back to site + logout */}
        <div className="px-3 py-4 border-t border-stone-700 space-y-1">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:bg-stone-800 hover:text-white transition-all"
          >
            <span>🌐</span><span>Back to Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:bg-rose-900/40 hover:text-rose-400 transition-all"
          >
            <span>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 bg-white border-b border-stone-200 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-stone-100"
          >
            <span className="w-4 h-0.5 bg-stone-600 rounded" />
            <span className="w-4 h-0.5 bg-stone-600 rounded" />
            <span className="w-3 h-0.5 bg-stone-600 rounded" />
          </button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
            🛡️ Admin
          </span>
          <div className="flex-1" />
          <p className="text-sm text-stone-400 hidden sm:block">
            Logged in as <span className="font-semibold text-stone-700">{user?.name}</span>
          </p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;