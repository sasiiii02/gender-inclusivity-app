import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getAllReports, 
  getAllEvents, 
  getAllSupport, 
  getReportStats 
} from "../../api/adminApi";
import { 
  ShieldAlert, 
  Calendar, 
  LifeBuoy, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  PlusCircle,
  Activity
} from "lucide-react";

const StatSection = ({ icon: Icon, label, value, subValue, colorClass, secondaryColor }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${secondaryColor} rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50`} />
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-serif font-black text-stone-900">{value}</h3>
        {subValue && <span className="text-xs font-bold text-stone-400">{subValue}</span>}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    reports: { total: 0, pending: 0, resolved: 0 }, 
    events: 0, 
    support: 0 
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [reportsRes, eventsRes, supportRes, statsRes] = await Promise.all([
          getAllReports(),
          getAllEvents(),
          getAllSupport(),
          getReportStats()
        ]);

        // 1. Data Parsing with fallback safety
        const reports = reportsRes.data?.reports || [];
        const events = eventsRes.data?.data?.events || []; // Backend returns paginated { events, pagination }
        const support = Array.isArray(supportRes.data) ? supportRes.data : (supportRes.data?.articles || []);
        const reportStats = statsRes.data || {};

        setStats({
          reports: { 
            total: reportStats.totalReports || reports.length, 
            pending: reportStats.openReports || 0, // Using openReports as 'Pending' measure
            resolved: reportStats.closedReports || 0 
          },
          events: events.length || reportStats.activeEvents || 0,
          support: support.length
        });
        
        setRecentReports(reports.slice(0, 5));
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (statusObj) => {
    const statusName = (statusObj?.name || statusObj || "pending").toLowerCase();
    const statusMap = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      investigating: "bg-blue-50 text-blue-600 border-blue-100",
      resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      dismissed: "bg-stone-50 text-stone-400 border-stone-100",
    };
    return statusMap[statusName] || "bg-stone-50 text-stone-400 border-stone-100";
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-stone-900">Operations Hub</h1>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live & Protected
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/admin/reports")}
            className="px-6 py-3 rounded-xl bg-stone-900 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-xl shadow-stone-200"
          >
            Review Incidents
          </button>
        </div>
      </div>

      {/* ── Hero Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatSection 
          icon={ShieldAlert} 
          label="Incident Reports" 
          value={stats.reports.total} 
          subValue={`${stats.reports.pending} Active`}
          colorClass="bg-rose-50 text-rose-600"
          secondaryColor="bg-rose-50"
        />
        <StatSection 
          icon={Calendar} 
          label="Active Events" 
          value={stats.events} 
          subValue="Registered Metrics"
          colorClass="bg-amber-50 text-amber-600"
          secondaryColor="bg-amber-50"
        />
        <StatSection 
          icon={LifeBuoy} 
          label="Support Articles" 
          value={stats.support} 
          subValue="Knowledge Base"
          colorClass="bg-violet-50 text-violet-600"
          secondaryColor="bg-violet-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Recent Activity ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-black text-stone-900">Recent Incidents</h2>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Latest platform reports</p>
              </div>
              <button 
                onClick={() => navigate("/admin/reports")}
                className="w-10 h-10 rounded-xl bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-400 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-stone-50 animate-pulse rounded-2xl" />
                ))
              ) : recentReports.length > 0 ? (
                recentReports.map((r) => (
                  <div key={r._id} className="group flex items-center justify-between p-4 rounded-2xl bg-stone-50/50 hover:bg-white border border-transparent hover:border-stone-100 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-800 line-clamp-1">{r.title || "Untitled Incident"}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mt-1">
                          {r.reportedBy?.name || "Anonymous User"} • {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(r.statusId)}`}>
                      {r.statusId?.name || "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No Recent Incidents</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-10">
              <Activity className="w-6 h-6 text-violet-600" />
              <h3 className="text-xl font-serif font-black text-stone-900">Administrative Shortcuts</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "New Event", icon: Calendar, path: "/admin/events" },
                { label: "Add Article", icon: FileText, path: "/admin/support" },
                { label: "Manage Quiz", icon: CheckCircle2, path: "/admin/quiz" },
                { label: "Safety Logs", icon: ShieldAlert, path: "/admin/reports" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-stone-50 hover:bg-violet-600 hover:text-white transition-all group border border-stone-100 hover:border-violet-600"
                >
                  <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Secondary Column ── */}
        <div className="space-y-8">
          
          {/* Support Base Summary */}
          <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <LifeBuoy className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Support Infrastructure</h4>
              <p className="text-2xl font-serif font-black mb-6 leading-tight">Maintain the school inclusivity knowledge base.</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-serif font-black">{stats.support}</span>
                <span className="text-xs font-bold text-stone-400 uppercase">Articles</span>
              </div>
              <button 
                onClick={() => navigate("/admin/support")}
                className="w-full py-4 rounded-xl bg-violet-600 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-500 transition-all font-serif"
              >
                Manage Resources
              </button>
            </div>
          </div>

          {/* Quick Create CTA */}
          <div className="bg-violet-50 rounded-[2.5rem] p-8 border border-violet-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-violet-800 uppercase tracking-widest">Deploy Content</p>
                <p className="text-[10px] text-violet-400 font-bold uppercase tracking-tight">Active Inclusivity Phase 3</p>
              </div>
            </div>
            <p className="text-sm font-medium text-stone-600 leading-relaxed mb-8 italic font-serif">
              "Every event and article added brings us closer to a fully inclusive campus."
            </p>
            <button 
              onClick={() => navigate("/admin/events")}
              className="w-full py-4 rounded-xl bg-white text-violet-700 text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all border border-violet-100"
            >
              Add New Event
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;