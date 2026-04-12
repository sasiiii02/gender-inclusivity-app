import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../store/authSlice";
import axiosInstance from "../../api/axiosInstance";
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [nameLoading, setNameLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState(null); // { type: 'success'|'error', text }
  const [passMsg, setPassMsg] = useState(null);

  // ── Update display name ──
  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === user.name) return;
    setNameLoading(true);
    setNameMsg(null);
    try {
      const res = await axiosInstance.put("/auth/profile", { name: name.trim() });
      dispatch(updateUser(res.data.user));
      setNameMsg({ type: "success", text: "Name updated successfully!" });
    } catch (err) {
      setNameMsg({ type: "error", text: err.response?.data?.message || "Failed to update name." });
    } finally {
      setNameLoading(false);
    }
  };

  // ── Change password ──
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setPassLoading(true);
    setPassMsg(null);
    try {
      await axiosInstance.put("/auth/profile", { currentPassword, newPassword });
      setPassMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPassMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setPassLoading(false);
    }
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-16">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-700 text-sm font-bold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Profile hero */}
      <div className="bg-stone-900 rounded-[2.5rem] p-10 flex items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-violet-600 rounded-full opacity-10" />
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Your Account</p>
          <h1 className="text-3xl font-serif font-black text-white">{user?.name}</h1>
          <p className="text-stone-400 text-sm font-medium mt-1">{user?.email}</p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-[10px] font-black uppercase tracking-widest border border-violet-500/30">
            {user?.role} Account
          </span>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <User className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-black text-stone-900">Personal Information</h2>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Update your display name</p>
          </div>
        </div>

        <form onSubmit={handleNameSave} className="space-y-6">
          {/* Name field */}
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Your full name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">
              Email Address <span className="text-stone-300 normal-case font-normal">(cannot be changed)</span>
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-stone-100 bg-stone-50/50 text-stone-400 text-sm">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{user?.email}</span>
            </div>
          </div>

          {nameMsg && (
            <div className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl ${
              nameMsg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
            }`}>
              {nameMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {nameMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={nameLoading || !name.trim() || name.trim() === user?.name}
            className="px-8 py-3.5 rounded-xl bg-stone-900 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {nameLoading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ── Security ── */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-black text-stone-900">Security</h2>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Change your password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSave} className="space-y-5">
          {/* Current password */}
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Minimum 6 characters"
              />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Re-enter new password"
            />
          </div>

          {passMsg && (
            <div className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl ${
              passMsg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
            }`}>
              {passMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {passMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={passLoading || !currentPassword || !newPassword || !confirmPassword}
            className="px-8 py-3.5 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {passLoading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Profile;
