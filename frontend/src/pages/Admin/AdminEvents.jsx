import { useState, useEffect } from "react";
import { campaignEventsApi } from "../../api/campaignEventsApi";

const empty = { title: "", description: "", startDate: "", endDate: "" };

const AdminEvents = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignEventsApi.getAllCampaigns();
      setItems(res.data || res); 
    } catch (error) {
      console.error("API Error fetching campaigns:", error);
      setError("Failed to load campaigns from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setForm(empty); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(empty); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await campaignEventsApi.createCampaign(form);
      fetchCampaigns(); // Refresh the list from the database
      closeForm();
    } catch (error) {
      console.error("API Error creating campaign:", error);
      alert("Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Campaign Management</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} active campaigns</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <span>+</span> Create Campaign
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>}

      {/* The List UI */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-stone-100" />)}</div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-stone-400">No campaigns found. Create your first one!</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-stone-50">
            {items.map(item => (
              <div key={item._id} className="flex items-center justify-between px-4 py-4 hover:bg-stone-50 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800">{item.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {item.description}
                  </p>
                  <p className="text-xs font-medium text-green-600 mt-1">
                    📅 {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                   <button className="text-xs btn-outline py-1.5 px-3">View Events</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold">Create Campaign</h3>
              <button onClick={closeForm} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Campaign Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field w-full" placeholder="e.g. Pride Month 2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field w-full resize-none" placeholder="Campaign goals..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Start Date</label>
                  <input type="date" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">End Date</label>
                  <input type="date" required value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input-field w-full" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60 bg-stone-900 text-white py-2 rounded">
                  {saving ? "Saving…" : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;