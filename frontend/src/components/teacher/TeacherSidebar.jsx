import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const teacherNavItems = [
  {
    label: "Dashboard",
    path: "/teacher/dashboard",
    description: "Overview & stats",
  },
  {
    label: "Learning",
    description: "Course Management",
    subItems: [
      {
        label: "Manage Courses",
        path: "/teacher/manage-courses",
      },
      {
        label: "Manage Lessons",
        path: "/teacher/lessons",
      },
      {
        label: "Enrolled Students",
        path: "/teacher/students",
      },
    ],
  },
  {
    label: "Create Quiz",
    path: "/teacher/quiz/new",
    description: "Create new quiz",
  },
  {
    label: "Results",
    path: "/teacher/results",
    description: "Student performance",
  },
  {
    label: "Live Sessions",
    path: "/teacher/live",
    description: "Active sessions",
  },
];

const TeacherSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState({ Learning: true });

  const toggleSubMenu = (label) => {
    setOpenSubMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 z-30
          flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-7 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
            Q
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-xl tracking-tight">
              Teacher Portal
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              Quiz Management
            </p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="hidden lg:block text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-900 transition-colors"
          >
            {expanded ? (
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
                  d="M11 19l-7-7 7-7"
                />
              </svg>
            ) : (
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
                  d="M13 5l7 7-7 7"
                />
              </svg>
            )}
          </button>

          <button
            onClick={onClose}
            className="lg:hidden text-zinc-400 hover:text-white p-2 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* User Profile */}
        {user && (
          <div className="mx-5 mt-6 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                {user.name?.charAt(0) || "T"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500">Teacher</p>
                <p className="text-[10px] text-zinc-500 mt-1 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
            MAIN MENU
          </p>

          <div className="space-y-1">
            {teacherNavItems.map((item) => {
              if (item.subItems) {
                const isSubMenuOpen = openSubMenus[item.label];
                return (
                  <div key={item.label} className="mb-2">
                    <button
                      onClick={() => {
                        setExpanded(true);
                        toggleSubMenu(item.label);
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium
                        transition-all duration-200 group text-zinc-300 hover:bg-zinc-900 hover:text-white
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-lg opacity-75">
                          •
                        </div>
                        {expanded && (
                          <div className="text-left flex-1">
                            <span className="block">{item.label}</span>
                            <span className="text-xs text-zinc-500 block mt-0.5">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </div>
                      {expanded && (
                        <span className="text-xs text-zinc-500">
                          {isSubMenuOpen ? "▼" : "▶"}
                        </span>
                      )}
                    </button>
                    {expanded && isSubMenuOpen && (
                      <div className="mt-1 ml-4 pl-3 border-l border-zinc-800 space-y-1">
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => {
                              if (onClose) onClose();
                            }}
                            className={({ isActive }) => `
                              flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium
                              transition-all duration-200 group
                              ${
                                isActive
                                  ? "bg-blue-600/10 text-blue-500"
                                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                              }
                            `}
                          >
                            <div className="w-5 h-5 flex items-center justify-center text-xs opacity-75">
                              -
                            </div>
                            <span>{subItem.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    }
                  `}
                >
                  <div className="w-5 h-5 flex items-center justify-center text-lg opacity-75">
                    •
                  </div>

                  {expanded && (
                    <div className="flex-1">
                      <span className="block">{item.label}</span>
                      <span className="text-xs text-zinc-500 block mt-0.5">
                        {item.description}
                      </span>
                    </div>
                  )}

                  {!expanded && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-zinc-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-xl z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-5 py-6 border-t border-zinc-800 space-y-2">
          {expanded && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleNavigate("/teacher/quiz/new")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-2xl transition-all active:scale-[0.985]"
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

              <button
                onClick={() => handleNavigate("/teacher/questions")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-2xl transition-all"
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2"
                  />
                </svg>
                Questions
              </button>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-zinc-400 hover:bg-rose-950 hover:text-rose-400 transition-all"
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4V7m-4 4V7"
              />
            </svg>
            {expanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
