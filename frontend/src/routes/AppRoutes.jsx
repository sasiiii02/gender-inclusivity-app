import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import StudentLayout from "../components/layout/StudentLayout";

// Admin pages
// Admin Reports
import AdminReportsDashboard from "../pages/Admin/reports/AdminReportsDashboard";
import AdminAllReports from "../pages/Admin/reports/AdminAllReports";
import AdminReportDetail from "../pages/Admin/reports/AdminReportDetail";
import AdminAllResponses from "../pages/Admin/reports/AdminAllResponses";
import AdminDashboard from "../pages/Admin/AdminDashboard";

// Admin Support
import AdminSupportList from "../pages/Admin/support/AdminSupportList";
import AdminCreateArticle from "../pages/Admin/support/AdminCreateArticle";
import AdminEditArticle from "../pages/Admin/support/AdminEditArticle";

import AdminUsers from "../pages/Admin/AdminUsers";
import AdminLearning from "../pages/Admin/AdminLearning";
import AdminQuiz from "../pages/Admin/AdminQuiz";
import AdminEvents from "../pages/Admin/AdminEvents";

// Teacher pages
import TeacherLayout from "../components/teacher/TeacherLayout";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import QuizEditor from "../pages/Teacher/QuizEditor";
import QuizQuestions from "../pages/Teacher/QuizQuestions";
import QuizLiveSession from "../pages/Teacher/QuizLiveSession";
import QuizResults from "../pages/Teacher/QuizResults";
import QuizAnalytics from "../pages/Teacher/QuizAnalytics";

// Student Quiz Routes
import StudentDashboard from "../pages/Student/StudentDashboard";
import QuizTaking from "../pages/Student/QuizTaking";
import QuizResult from "../pages/Student/QuizResult";
import QuizHistory from "../pages/Student/QuizHistory";
import QuizJoin from "../pages/Student/QuizJoin";
import QuizExplanations from "../pages/Student/QuizExplanations";

// New Student Pages
import StudentHome from "../pages/Student/StudentHome";
import StudentCourses from "../pages/Student/StudentCourses";
import StudentEvents from "../pages/Student/StudentEvents";

// Incident Reporting & Support Integration
import MyReports      from "../pages/Report/MyReports";
import SubmitReport   from "../pages/Report/SubmitReport";
import ReportSuccess  from "../pages/Report/ReportSuccess";
import ReportDetail   from "../pages/Report/ReportDetail";
import SupportHome    from "../pages/Support/SupportHome";
import ArticleDetail  from "../pages/Support/ArticleDetail";

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
    <Route path="/quiz/join/:quizLink" element={<QuizJoin />} />

    {/* Student / Teacher pages — TopNav layout (MainLayout) */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/quiz" element={<Placeholder label="📝 Quiz" />} />
      <Route path="/events" element={<Placeholder label="📅 Events" />} />
      <Route path="/chat" element={<Placeholder label="🤖 Chatbot" />} />
    </Route>

    {/* Student pages — No Sidebar layout (StudentLayout) */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/courses" element={<StudentCourses />} />
      
      {/* Support System (Student) */}
      <Route path="/student/support" element={<SupportHome />} />
      <Route path="/student/support/:id" element={<ArticleDetail />} />

      {/* Reports System (Student) */}
      <Route path="/student/reports"          element={<MyReports />} />
      <Route path="/student/reports/submit"   element={<SubmitReport />} />
      <Route path="/student/reports/success"  element={<ReportSuccess />} />
      <Route path="/student/reports/:id"      element={<ReportDetail />} />

      <Route path="/student/events" element={<StudentEvents />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route
        path="/student/quiz/take/:studentQuizId"
        element={<QuizTaking />}
      />
      <Route
        path="/student/quiz/result/:studentQuizId"
        element={<QuizResult />}
      />
      <Route
        path="/student/quiz/:studentQuizId/explanations"
        element={<QuizExplanations />}
      />
      <Route path="/student/quiz/history" element={<QuizHistory />} />
    </Route>

    {/* Admin pages — Sidebar layout (AdminLayout) */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/reports" element={<AdminReportsDashboard />} />
      <Route path="/admin/reports/all" element={<AdminAllReports />} />
      <Route path="/admin/reports/responses" element={<AdminAllResponses />} />
      <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
      
      <Route path="/admin/support" element={<AdminSupportList />} />
      <Route path="/admin/support/create" element={<AdminCreateArticle />} />
      <Route path="/admin/support/:id/edit" element={<AdminEditArticle />} />

      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/learning" element={<AdminLearning />} />
      <Route path="/admin/quiz" element={<AdminQuiz />} />
      <Route path="/admin/events" element={<AdminEvents />} />
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
      <Route path="/teacher/quiz/:quizId/live" element={<QuizLiveSession />} />
      <Route path="/teacher/quiz/:quizId/results" element={<QuizResults />} />
      <Route
        path="/teacher/quiz/:quizId/analytics"
        element={<QuizAnalytics />}
      />
    </Route>

    <Route path="*" element={<Placeholder label="404 Not Found" />} />
  </Routes>
);

export default AppRoutes;
