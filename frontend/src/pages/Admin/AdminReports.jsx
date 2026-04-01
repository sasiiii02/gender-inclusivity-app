import { useState, useEffect } from "react";
import {
  getAllReports,
  updateReportStatus,
  addReportResponse,
  getReportTimeline,
  closeReport,
  getReportStats,
} from "../../api/adminApi";

const STATUSES = ["pending", "investigating", "resolved", "dismissed"];

const statusColor = {
  pending:       "bg-amber-100 text-amber-700",
  investigating: "bg-blue-100 text-blue-700",
  resolved:      "bg-green-100 text-green-700",
  dismissed:     "bg-stone-100 text-stone-500",
  closed:        "bg-rose-100 text-rose-700",
};

const AdminReports = () => {
  const [reports, setReports]     = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filter, setFilter]       = useState("all");
  const [selected, setSelected]   = useState(null);
  const [timeline, setTimeline]   = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [updating, setUpdating]   = useState(false);
  const [response, setResponse]   = useState("");
  const [sending, setSending]     = useState(false);
  const [closing, setClosing]     = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsRes, statsRes] = await Promise.all([
          getAllReports(),
          getReportStats(),
        ]);

        // handle both array and wrapped responses e.g. { reports: [] } or { data: [] }
        const raw = reportsRes.data;
        if (Array.isArray(raw)) {
          setReports(raw);
        } else if (Array.isArray(raw?.reports)) {
          setReports(raw.reports);
        } else if (Array.isArray(raw?.data)) {
          setReports(raw.data);
        } else {
          setReports([]);
        }

        setStats(statsRes.data || null);
      } catch {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDetail = async (report) => {
    setSelected(report);
    setResponse("");
    setTimeline([]);
    setTimelineLoading(true);
    try {
      const res = await getReportTimeline(report._id);
      const raw = res.data;
      setTimeline(Array.isArray(raw) ? raw : Array.isArray(raw?.timeline) ? raw.timeline : []);
    } catch {
      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      await updateReportStatus(id, status);
      const updated = { ...selected, status };
      setSelected(updated);
      setReports(reports.map(r => r._id === id ? updated : r));
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    setSending(true);
    try {
      await addReportResponse(selected._id, { message: response });
      setResponse("");
      // refresh timeline
      const res = await getReportTimeline(selected._id);
      const raw = res.data;
      setTimeline(Array.isArray(raw) ? raw : Array.isArray(raw?.timeline) ? raw.timeline : []);
    } catch {
      alert("Failed to send response.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm("Close this report? This cannot be undone.")) return;
    setClosing(true);
    try {
      await closeReport(selected._id);
      const updated = { ...selected, status: "closed" };
      setSelected(updated);
      setReports(reports.map(r => r._id === selected._id ? updated : r));
    } catch {
      alert("Failed to close report.");
    } finally {
      setClosing(false);
    }
  };

  const filtered = filter === "all"
    ? reports
    : reports.filter(r => r.status === filter);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Incident Reports</h1>
        <p className="text-stone-500 text-sm mt-0.5">{reports.length} total reports</p>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",        value: stats.total        ?? reports.length, color: "border-stone-300" },
            { label: "Pending",      value: stats.pending      ?? 0,              color: "border-amber-400" },
            { label: "Investigating",value: stats.investigating ?? 0,              color: "border-blue-400"  },
            { label: "Resolved",     value: stats.resolved     ?? 0,              color: "border-green-400" },
          ].map(s => (
            <div key={s.label} className={`card border-l-4 ${s.color} py-3`}>
              <p className="text-xs text-stone-500 font-medium">{s.label}</p>
              <p className="font-serif text-2xl font-bold text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...STATUSES, "closed"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
              filter === s
                ? "bg-violet-700 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:border-violet-300"
            }`}
          >
            {s === "all"
              ? `All (${reports.length})`
              : `${s} (${reports.filter(r => r.status === s).length})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>
      )}

      {/* Reports list */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-400">Loading reports…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-stone-400">No reports found.</div>
        ) : (
          <div className="divide-y divide-stone-50">
            {filtered.map(r => (
              <div
                key={r._id}
                onClick={() => openDetail(r)}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">
                    {r.title || "Untitled Report"}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    By {r.submittedBy?.name || r.user?.name || "Anonymous"} ·{" "}
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
                <span className={`badge ml-4 flex-shrink-0 capitalize ${statusColor[r.status] || "bg-stone-100 text-stone-500"}`}>
                  {r.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col animate-slide-up">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
              <h3 className="font-serif text-lg font-bold text-stone-900">Report Detail</h3>
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>

            <div className="overflow-y-auto px-6 py-4 space-y-5 flex-1">

              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Title</p>
                  <p className="text-stone-800 font-semibold mt-0.5">{selected.title || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Submitted By</p>
                  <p className="text-stone-800 mt-0.5">{selected.submittedBy?.name || selected.user?.name || "Anonymous"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Description</p>
                <p className="text-stone-700 text-sm mt-0.5 leading-relaxed">{selected.description || "—"}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected._id, s)}
                      disabled={updating || selected.status === "closed"}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all disabled:opacity-50 ${
                        selected.status === s
                          ? statusColor[s] + " ring-2 ring-offset-1 ring-violet-400"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">Timeline</p>
                {timelineLoading ? (
                  <p className="text-xs text-stone-400">Loading timeline…</p>
                ) : timeline.length === 0 ? (
                  <p className="text-xs text-stone-400">No timeline entries yet.</p>
                ) : (
                  <div className="space-y-2">
                    {timeline.map((t, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-stone-700">{t.message || t.note || t.status}</p>
                          <p className="text-xs text-stone-400">
                            {t.by?.name || t.responder?.name || "System"} ·{" "}
                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Respond */}
              {selected.status !== "closed" && (
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">Send Response</p>
                  <textarea
                    rows={3}
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    placeholder="Write a response to the reporter…"
                    className="input-field resize-none"
                  />
                  <button
                    onClick={handleSendResponse}
                    disabled={sending || !response.trim()}
                    className="btn-primary mt-2 w-full disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send Response"}
                  </button>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-stone-100 flex gap-3 flex-shrink-0">
              {selected.status !== "closed" && (
                <button
                  onClick={handleClose}
                  disabled={closing}
                  className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium py-3 rounded-xl transition-all disabled:opacity-60 text-sm"
                >
                  {closing ? "Closing…" : "🔒 Close Report"}
                </button>
              )}
              <button onClick={() => setSelected(null)} className="btn-outline flex-1">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;