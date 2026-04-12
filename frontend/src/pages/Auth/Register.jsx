import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(res.data.user, res.data.token);
      
      if (res.data.user.role === "student") {
        navigate("/student/home");
      } else if (res.data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "student", label: "Student", icon: "👤", desc: "Access learning & events" },
    { value: "teacher", label: "Staff", icon: "🧑‍💼", desc: "Manage reports & support" },
    { value: "admin", label: "Admin", icon: "🛡️", desc: "Full system access" },
  ];

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Too short", color: "bg-rose-400", width: "w-1/4" };
    if (pwd.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: "Medium", color: "bg-amber-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-teal-500", width: "w-full" };
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100/50 p-6 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 animate-slide-up my-8">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-3xl shadow-xl shadow-violet-200 mb-6">
            🌈
          </div>
          <h1 className="text-3xl font-serif font-black text-stone-900 tracking-tight mb-2">
            Join InclusiveSpace
          </h1>
          <p className="text-stone-400 font-medium">
            Step into a safe, connected community.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-3 animate-fade-in">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="input-field"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    form.role === r.value
                      ? "border-violet-600 bg-violet-50 text-violet-700 shadow-md shadow-violet-100"
                      : "border-stone-50 bg-stone-50/50 text-stone-500 hover:border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{r.label}</span>
                  {form.role === r.value && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.533-4.533A9.01 9.01 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-1.313 0-2.557-.313-3.655-.87m-4.533-4.533L3 3m18 18l-9-9m1.5 1.5l.504-.504" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Strength indicator */}
              {strength && (
                <div className="mt-2 flex items-center gap-2 px-1">
                  <div className="h-1 flex-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-tighter">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">
                Confirm
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.533-4.533A9.01 9.01 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-1.313 0-2.557-.313-3.655-.87m-4.533-4.533L3 3m18 18l-9-9m1.5 1.5l.504-.504" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full shadow-violet-200/50 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Initialize Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-stone-500 font-medium">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-violet-600 font-bold hover:underline"
            >
              Sign In Instead
            </Link>
          </p>
          <div className="pt-8 border-t border-stone-100">
            <p className="text-[10px] text-stone-300 font-bold uppercase tracking-widest leading-loose">
              By joining, you agree to our <br />
              <span className="text-stone-400 hover:text-violet-500 cursor-pointer transition-colors">Privacy Charter</span> & <span className="text-stone-400 hover:text-violet-500 cursor-pointer transition-colors">Community Compact</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;