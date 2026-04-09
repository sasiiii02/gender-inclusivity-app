import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
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
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-violet-700 overflow-hidden flex-col justify-between p-14">
        {/* Background blobs */}
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
            Every voice
            <br />
            <span className="text-amber-300">belongs here.</span>
          </h1>
          <p className="text-violet-200 text-lg leading-relaxed max-w-sm">
            A safe, inclusive platform to learn, report, connect, and grow — for
            everyone, without exception.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex gap-8">
            {[
              { value: "2.4k+", label: "Members" },
              { value: "80+", label: "Resources" },
              { value: "100%", label: "Safe Space" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-2xl font-serif font-bold">{s.value}</p>
                <p className="text-violet-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative tags */}
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

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 bg-stone-50">
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">🌈</span>
            <span className="font-serif text-xl font-semibold text-violet-700">
              InclusiveSpace
            </span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-1">
            Welcome back
          </h2>
          <p className="text-stone-500 text-sm mb-8">
            Sign in to your account to continue
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-violet-600 hover:text-violet-700"
                >
                  Forgot password?
                </Link>
              </div>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-stone-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Create one — it's free
            </Link>
          </p>

          {/* Footer note */}
          <p className="mt-10 text-center text-xs text-stone-400 leading-relaxed">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;