import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

// ── Placeholders (replace as you build each module) ──
const Placeholder = ({ label }) => (
  <div className="flex items-center justify-center h-64">
    <p className="font-serif text-2xl text-violet-700">{label} — coming soon</p>
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected — all share MainLayout (Sidebar + Navbar) */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Placeholder label="🏠 Dashboard" />} />
      <Route path="/learning"  element={<Placeholder label="📚 Learning" />} />
      <Route path="/quiz"      element={<Placeholder label="📝 Quiz" />} />
      <Route path="/events"    element={<Placeholder label="📅 Events" />} />
      <Route path="/reports"   element={<Placeholder label="🚨 Reports" />} />
      <Route path="/support"   element={<Placeholder label="🛟 Support" />} />
      <Route path="/chat"      element={<Placeholder label="🤖 Chatbot" />} />

      {/* Admin only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Placeholder label="🛡️ Admin Panel" />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="*" element={<Placeholder label="404 Not Found" />} />
  </Routes>
);

export default AppRoutes;