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
      } else if (res.data.user.role === "admin") {
        navigate("/admin");
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
    <div className="min-h-screen flex items-center justify-center bg-stone-100/50 p-6 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 animate-slide-up">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-3xl shadow-xl shadow-violet-200 mb-6">
            🌈
          </div>
          <h1 className="text-3xl font-serif font-black text-stone-900 tracking-tight mb-2">
            InclusiveSpace
          </h1>
          <p className="text-stone-400 font-medium">
            Empowering every voice, everywhere.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-3 animate-fade-in">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">
              Work Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
              className="input-field"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Reset?
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
                className="input-field pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.533-4.533A9.01 9.01 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-1.313 0-2.557-.313-3.655-.87m-4.533-4.533L3 3m18 18l-9-9m1.5 1.5l.504-.504" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full shadow-violet-200/50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-stone-500">
            New to the space?{" "}
            <Link
              to="/register"
              className="text-violet-600 font-bold hover:underline"
            >
              Request Access
            </Link>
          </p>
          <div className="pt-8 border-t border-stone-100">
            <p className="text-[10px] text-stone-300 font-bold uppercase tracking-widest leading-loose">
              By entering, you agree to our <br />
              <span className="text-stone-400 hover:text-violet-500 cursor-pointer transition-colors">Safety Guidelines</span> & <span className="text-stone-400 hover:text-violet-500 cursor-pointer transition-colors">Privacy Standards</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;