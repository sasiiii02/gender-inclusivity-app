import { useState, useEffect } from "react";
import { getAllSupport, createSupport, updateSupport, deleteSupport } from "../../api/adminApi";

const empty = { title: "", content: "", category: "" };

const AdminSupport = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAllSupport()
      .then(res => setItems(res.data || []))
      .catch(() => setError("Failed to load articles."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit   = (item) => { setEditing(item); setForm({ title: item.title, content: item.content, category: item.category || "" }); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateSupport(editing._id, form);
        setItems(items.map(i => i._id === editing._id ? { ...i, ...form } : i));
      } else {
        const res = await createSupport(form);
        setItems([res.data, ...items]);
      }
      closeForm();
    } catch {
      alert("Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    setDeleting(id);
    try {
      await deleteSupport(id);
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
          <h1 className="font-serif text-2xl font-bold text-stone-900">Support Articles</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} articles</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <span>+</span> Add Article
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>}

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-stone-100" />)}</div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-stone-400">No support articles yet.</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-stone-50">
            {items.map(item => (
              <div key={item._id} className="flex items-center justify-between px-4 py-4 hover:bg-stone-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-stone-800">{item.title}</p>
                    {item.category && <span className="badge bg-teal-100 text-teal-700">{item.category}</span>}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{item.content}</p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="text-xs btn-outline py-1.5 px-3">Edit</button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium py-1.5 px-3 rounded-xl transition-all disabled:opacity-60"
                  >
                    {deleting === item._id ? "…" : "Delete"}
                  </button>
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
              <h3 className="font-serif text-lg font-bold">{editing ? "Edit Article" : "Add Article"}</h3>
              <button onClick={closeForm} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="Article title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" placeholder="e.g. Mental Health, Resources" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Content</label>
                <textarea required rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field resize-none" placeholder="Article content…" />
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

export default AdminSupport;