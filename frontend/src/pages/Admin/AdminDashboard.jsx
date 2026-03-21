import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/adminApi";
import { getAllReports } from "../../api/adminApi";
import { getAllEvents } from "../../api/adminApi";
import { getAllLearning } from "../../api/adminApi";

const StatCard = ({ icon, label, value, color, onClick }) => (
  <div
    onClick={onClick}
    className={`card cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-stone-500 font-medium">{label}</p>
        <p className="font-serif text-3xl font-bold text-stone-900 mt-1">
          {value ?? "—"}
        </p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: null, reports: null, events: null, learning: null });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [users, reports, events, learning] = await Promise.all([
          getAllUsers(),
          getAllReports(),
          getAllEvents(),
          getAllLearning(),
        ]);
        setStats({
          users: users.data?.length ?? 0,
          reports: reports.data?.length ?? 0,
          events: events.data?.length ?? 0,
          learning: learning.data?.length ?? 0,
        });
        setRecentReports((reports.data || []).slice(0, 5));
      } catch {
        // silently fail — stats just show —
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statusColor = {
    pending:     "bg-amber-100 text-amber-700",
    investigating: "bg-blue-100 text-blue-700",
    resolved:    "bg-green-100 text-green-700",
    dismissed:   "bg-stone-100 text-stone-500",
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Overview of the InclusiveSpace platform</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-stone-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="👥" label="Total Users"     value={stats.users}    color="border-violet-500" onClick={() => navigate("/admin/users")} />
          <StatCard icon="🚨" label="Incident Reports" value={stats.reports}  color="border-rose-500"   onClick={() => navigate("/admin/reports")} />
          <StatCard icon="📅" label="Events"          value={stats.events}   color="border-amber-500"  onClick={() => navigate("/admin/events")} />
          <StatCard icon="📚" label="Learning Items"  value={stats.learning} color="border-teal-500"   onClick={() => navigate("/admin/learning")} />
        </div>
      )}

      {/* Quick actions */}
      <div className="card">
        <h2 className="font-serif text-lg font-semibold text-stone-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Manage Users",    icon: "👥", path: "/admin/users" },
            { label: "View Reports",    icon: "🚨", path: "/admin/reports" },
            { label: "Add Learning",    icon: "📚", path: "/admin/learning" },
            { label: "Add Quiz",        icon: "📝", path: "/admin/quiz" },
            { label: "Create Event",    icon: "📅", path: "/admin/events" },
            { label: "Add Support",     icon: "🛟", path: "/admin/support" },
          ].map((a) => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-stone-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-center"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-medium text-stone-600">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-stone-800">Recent Incident Reports</h2>
          <button onClick={() => navigate("/admin/reports")} className="text-xs text-violet-600 hover:underline">
            View all →
          </button>
        </div>

        {recentReports.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-6">No reports yet</p>
        ) : (
          <div className="space-y-2">
            {recentReports.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{r.title || "Untitled Report"}</p>
                  <p className="text-xs text-stone-400">{r.submittedBy?.name || "Anonymous"}</p>
                </div>
                <span className={`badge ml-3 flex-shrink-0 ${statusColor[r.status] || "bg-stone-100 text-stone-500"}`}>
                  {r.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;