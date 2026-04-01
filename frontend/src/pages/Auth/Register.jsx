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
      navigate("/dashboard");
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
    <div className="min-h-screen flex">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-violet-700 overflow-hidden flex-col justify-between p-14">
        <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] bg-violet-500 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] bg-fuchsia-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-amber-400 rounded-full opacity-10 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl">
              🌈
            </div>
            <span className="text-white font-serif text-xl font-semibold">
              InclusiveSpace
            </span>
          </div>
        </div>

        {/* Centre text */}
        <div className="relative z-10">
          <h1 className="text-white font-serif text-5xl font-bold leading-tight mb-6">
            Join a space
            <br />
            <span className="text-amber-300">built for all.</span>
          </h1>
          <p className="text-violet-200 text-lg leading-relaxed max-w-sm">
            Create your free account and be part of a community that champions
            inclusion, respect, and equity for every individual.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-3">
            {[
              "📚 Access curated learning resources",
              "📝 Take quizzes and track your growth",
              "📅 Join events and campaigns",
              "🚨 Report incidents safely and confidentially",
              "🤖 Chat with our AI support assistant",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-violet-200 text-sm">
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {["Inclusive", "Safe", "Empowering", "Supportive", "Equal"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur border border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 bg-stone-50 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">🌈</span>
            <span className="font-serif text-xl font-semibold text-violet-700">
              InclusiveSpace
            </span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-1">
            Create your account
          </h2>
          <p className="text-stone-500 text-sm mb-8">
            Fill in the details below to get started
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Full name
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
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                I am joining as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all duration-150 ${
                      form.role === r.value
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-stone-200 bg-white text-stone-600 hover:border-violet-300"
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-xs font-semibold">{r.label}</span>
                    <span className="text-[10px] text-stone-400 leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    form.password === form.confirmPassword
                      ? "text-teal-600"
                      : "text-rose-500"
                  }`}
                >
                  {form.password === form.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Sign in instead
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-stone-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;