import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { campaignEventsApi } from "../../api/campaignEventsApi";

const emptyCampaign = { title: "", description: "", startDate: "", endDate: "" };
const emptyEvent = {
  title: "",
  eventType: "Workshop",
  eventDate: "",
  location: "",
  capacity: "",
  speaker: ""
};

const AdminEvents = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  
  // Campaign Modal State
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyCampaign);
  
  // Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm]           = useState(emptyEvent);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const [saving, setSaving]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignEventsApi.getAllCampaigns();
      const campaigns = res?.data?.campaigns || [];
      setItems(Array.isArray(campaigns) ? campaigns : []);
      setError("");
    } catch (error) {
      console.error("API Error fetching campaigns:", error);
      setError("Failed to load campaigns from the backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- Campaign Handlers ---
  const openCreate = () => { setForm(emptyCampaign); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(emptyCampaign); };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        status: 'Active',
      };
      if (payload.description.length < 20) {
        alert('Description must be at least 20 characters long.');
        setSaving(false);
        return;
      }
      await campaignEventsApi.createCampaign(payload);
      fetchCampaigns();
      closeForm();
    } catch (error) {
      console.error('Full error:', error);
      const backendMessage = error.response?.data?.message || error.message;
      alert(`Backend Error: ${backendMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // --- Event Handlers ---
  const openEventModal = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setEventForm(emptyEvent);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setEventForm(emptyEvent);
    setSelectedCampaignId(null);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      alert("Please select a campaign before creating an event.");
      return;
    }

    const eventDate = new Date(eventForm.eventDate);
    if (Number.isNaN(eventDate.getTime())) {
      alert("Please provide a valid event date.");
      return;
    }

    setSaving(true);
    try {
      const createResponse = await campaignEventsApi.createEvent(selectedCampaignId, {
        title: eventForm.title.trim(),
        eventType: eventForm.eventType,
        eventDate: eventDate.toISOString(),
        location: eventForm.location.trim(),
        capacity: Number(eventForm.capacity),
        speaker: eventForm.speaker.trim(),
        status: "Published",
      });

      const createdEvent = createResponse?.data || createResponse;
      if (!createdEvent?._id) {
        throw new Error("Event creation response is missing event data.");
      }
      
      alert("Event Created Successfully!");
      closeEventModal();
      fetchCampaigns(); // Refresh campaign list
    } catch (error) {
      console.error("API Error creating event:", error);
      alert(`Failed to create event: ${error.response?.data?.message || error.message}`);
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
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors font-medium">
          <span>+</span> Create Campaign
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>}

      {/* Campaign List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse border border-stone-100" />)}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-100 text-center py-16 text-stone-400 shadow-sm">
          No campaigns found. Create your first one to get started!
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-stone-50">
            {items.map(item => (
              <div key={item._id} className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 hover:bg-stone-50 transition-colors gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-800 text-lg">{item.title}</p>
                  <p className="text-sm text-stone-500 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-xs font-semibold text-violet-600 mt-2 bg-violet-50 inline-block px-2 py-1 rounded">
                    📅 {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <button onClick={() => openEventModal(item._id)} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 font-semibold py-2 px-3 rounded-lg border border-green-200 transition-colors flex items-center gap-1">
                    <span>+</span> Add Event
                  </button>
                  <button onClick={() => navigate('/student/events')} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold py-2 px-3 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1">
                    👁️ View Events
                  </button>
                  <button onClick={() => navigate('/admin/analytics')} className="text-xs bg-white text-stone-700 hover:bg-stone-100 font-semibold py-2 px-3 rounded-lg border border-stone-200 transition-colors">
                    📊 Analytics
                  </button>
                  <button onClick={() => navigate('/admin/attendance')} className="text-xs bg-violet-600 text-white hover:bg-violet-700 font-semibold py-2 px-3 rounded-lg transition-colors">
                    ✅ Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
              <h3 className="font-serif text-xl font-bold text-stone-800">Create Campaign</h3>
              <button onClick={closeForm} className="text-stone-400 hover:text-stone-600 text-2xl transition-colors">×</button>
            </div>
            <form onSubmit={handleCreateCampaign} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Campaign Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="e.g. Pride Month 2026" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none resize-none" placeholder="Campaign goals..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Start Date</label>
                  <input type="date" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">End Date</label>
                  <input type="date" required value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeForm} className="flex-1 px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors disabled:opacity-60">
                  {saving ? "Saving…" : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-green-100 bg-green-50/50">
              <h3 className="font-serif text-xl font-bold text-green-800">Create New Event</h3>
              <button onClick={closeEventModal} className="text-stone-400 hover:text-stone-600 text-2xl transition-colors">×</button>
            </div>
            <form onSubmit={handleCreateEvent} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Title</label>
                <input required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Inclusivity Workshop" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Type</label>
                <select required value={eventForm.eventType} onChange={e => setEventForm({...eventForm, eventType: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Debate">Debate</option>
                  <option value="Awareness Drive">Awareness Drive</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Date</label>
                  <input type="date" required value={eventForm.eventDate} onChange={e => setEventForm({...eventForm, eventDate: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Capacity</label>
                  <input type="number" required value={eventForm.capacity} onChange={e => setEventForm({...eventForm, capacity: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 50" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Speaker / Facilitator</label>
                <input required value={eventForm.speaker} onChange={e => setEventForm({...eventForm, speaker: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Dr. Jane Smith" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Location</label>
                <input required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Room 101 or Zoom Link" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeEventModal} className="flex-1 px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60">
                  {saving ? "Saving…" : "Publish Event"}
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