import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Admin pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminReports from "../pages/Admin/AdminReports";
import AdminLearning from "../pages/Admin/AdminLearning";
import AdminQuiz from "../pages/Admin/AdminQuiz";
import AdminEvents from "../pages/Admin/AdminEvents";
import AdminSupport from "../pages/Admin/AdminSupport";

// Teacher pages
import TeacherLayout from "../components/teacher/TeacherLayout";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import QuizEditor from "../pages/Teacher/QuizEditor";
import QuizQuestions from "../pages/Teacher/QuizQuestions";

// Placeholders for student/teacher pages (replace as you build them)
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

    {/* Student / Teacher pages — TopNav layout (MainLayout) */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Placeholder label="🏠 Dashboard" />} />
      <Route path="/learning" element={<Placeholder label="📚 Learning" />} />
      <Route path="/quiz" element={<Placeholder label="📝 Quiz" />} />
      <Route path="/events" element={<Placeholder label="📅 Events" />} />
      <Route path="/reports" element={<Placeholder label="🚨 Reports" />} />
      <Route path="/support" element={<Placeholder label="🛟 Support" />} />
      <Route path="/chat" element={<Placeholder label="🤖 Chatbot" />} />
    </Route>

    {/* Admin pages — Sidebar layout (AdminLayout) */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/learning" element={<AdminLearning />} />
      <Route path="/admin/quiz" element={<AdminQuiz />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/admin/support" element={<AdminSupport />} />
    </Route>

    {/* Admin pages — Sidebar layout (AdminLayout) */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["teacher", "admin"]}>
          <TeacherLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/quiz/new" element={<QuizEditor />} />
      <Route path="/teacher/quiz/:id/edit" element={<QuizEditor />} />
      <Route path="/teacher/quiz/:id/questions" element={<QuizQuestions />} />
    </Route>

    <Route path="*" element={<Placeholder label="404 Not Found" />} />
  </Routes>
);

export default AppRoutes;
