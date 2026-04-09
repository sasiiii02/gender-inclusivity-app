import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    icon: "🏠",
    path: "/dashboard",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Learning",
    icon: "📚",
    path: "/learning",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Quiz",
    icon: "📝",
    path: "/quiz",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Events",
    icon: "📅",
    path: "/events",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Reports",
    icon: "🚨",
    path: "/reports",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Support",
    icon: "🛟",
    path: "/support",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Chatbot",
    icon: "🤖",
    path: "/chat",
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Admin Panel",
    icon: "🛡️",
    path: "/admin",
    roles: ["admin"],
  },
  {
    label: "My Quizzes",
    icon: "📝",
    path: "/teacher/dashboard",
    roles: ["teacher"],
  },
  {
    label: "My Quizzes",
    icon: "📝",
    path: "/student/dashboard",
    roles: ["student"],
  },
  {
    label: "Quiz History",
    icon: "📊",
    path: "/student/quiz/history",
    roles: ["student"],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filtered = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  const roleColors = {
    student: "bg-violet-100 text-violet-700",
    teacher: "bg-amber-100 text-amber-700",
    admin: "bg-rose-100 text-rose-700",
  };

  const roleLabel = {
    student: "Student",
    teacher: "Teacher",
    admin: "Administrator",
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-100 z-30
          flex flex-col transition-transform duration-300 ease-in-out shadow-soft
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-stone-100">
          <div className="w-9 h-9 rounded-xl bg-violet-700 flex items-center justify-center text-lg">
            🌈
          </div>
          <div>
            <p className="font-serif font-bold text-stone-900 text-base leading-tight">
              InclusiveSpace
            </p>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">
              Platform
            </p>
          </div>
          {/* Close btn - mobile */}
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-stone-400 hover:text-stone-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* User card */}
        {user && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-700 flex items-center justify-center text-white font-serif font-bold text-sm uppercase">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">
                  {user.name}
                </p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${
                    roleColors[user.role] || "bg-stone-100 text-stone-600"
                  }`}
                >
                  {roleLabel[user.role] || user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
            Menu
          </p>
          {filtered.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-violet-700 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom: logout */}
        <div className="px-3 py-4 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
          >
            <span className="text-base">🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
