import { useState, useEffect } from "react";
import { getAllLearning, createLearning, updateLearning, deleteLearning } from "../../api/adminApi";

const empty = { title: "", description: "", content: "", category: "" };

const AdminLearning = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchItems = () => {
    setLoading(true);
    getAllLearning()
      .then(res => setItems(res.data || []))
      .catch(() => setError("Failed to load materials."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit   = (item) => { setEditing(item); setForm({ title: item.title, description: item.description, content: item.content, category: item.category }); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateLearning(editing._id, form);
        setItems(items.map(i => i._id === editing._id ? { ...i, ...form } : i));
      } else {
        const res = await createLearning(form);
        setItems([res.data, ...items]);
      }
      closeForm();
    } catch {
      alert("Failed to save material.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    setDeleting(id);
    try {
      await deleteLearning(id);
      setItems(items.filter(i => i._id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Learning Materials</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} materials</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <span>+</span> Add Material
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-32 animate-pulse bg-stone-100" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-stone-400">No learning materials yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item._id} className="card hover:shadow-md transition-all duration-200">
              {item.category && (
                <span className="badge bg-violet-100 text-violet-700 mb-2">{item.category}</span>
              )}
              <h3 className="font-serif font-semibold text-stone-900 mb-1">{item.title}</h3>
              <p className="text-stone-500 text-sm line-clamp-2 mb-4">{item.description}</p>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => openEdit(item)} className="flex-1 text-xs btn-outline py-2">Edit</button>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting === item._id}
                  className="flex-1 text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium py-2 rounded-xl transition-all disabled:opacity-60"
                >
                  {deleting === item._id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold">{editing ? "Edit Material" : "Add Material"}</h3>
              <button onClick={closeForm} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="Material title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" placeholder="e.g. Gender Identity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                <textarea required rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none" placeholder="Short description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Content</label>
                <textarea required rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field resize-none" placeholder="Full content…" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLearning;