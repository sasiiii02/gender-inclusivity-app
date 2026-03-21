import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/adminApi";

const ROLES = ["student", "teacher", "admin"];

const roleColor = {
  student: "bg-violet-100 text-violet-700",
  teacher: "bg-amber-100 text-amber-700",
  admin:   "bg-rose-100 text-rose-700",
};

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    setUpdating(id);
    try {
      await updateUserRole(id, role);
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    } catch {
      alert("Failed to update role.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      setConfirmDelete(null);
    } catch {
      alert("Failed to delete user.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">User Management</h1>
          <p className="text-stone-500 text-sm mt-0.5">{users.length} total users</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      {error && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-400">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-stone-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-stone-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u._id, e.target.value)}
                        disabled={updating === u._id}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 ${roleColor[u.role] || "bg-stone-100 text-stone-600"}`}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Delete User?</h3>
            <p className="text-stone-500 text-sm mb-5">
              Are you sure you want to delete <span className="font-semibold text-stone-800">{confirmDelete.name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                disabled={deleting === confirmDelete._id}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-3 rounded-xl transition-all disabled:opacity-60"
              >
                {deleting === confirmDelete._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;