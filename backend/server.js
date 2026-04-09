import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";

// --- NEW IMPORTS ADDED HERE BY eshan ---
import eCampaignRoutes from "./routes/eCampaignRoutes.js";
import eEventRoutes from "./routes/eEventRoutes.js";
import eRegistrationRoutes from "./routes/eRegistrationRoutes.js";
import eFeedbackRoutes from "./routes/eFeedbackRoutes.js";

// Quiz routes
import QMQuizRoutes from "./routes/QM-quizRoutes.js";
import QMStudentQuizRoutes from "./routes/QM-studentQuizRoutes.js";
import QMQuestionRoutes from "./routes/QM-questionRoutes.js";

// AI Explanation routes
import QMAiRoutes from "./routes/QM-aiRoutes.js";


// Report routes
import reportRoutes from "./routes/reportRoutes.js"; 
import supportArticleRoutes from "./routes/supportArticleRoutes.js";
import supportChatRoutes from "./routes/supportChatRoutes.js";


// Course, Lesson, and Enrollment routes
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

dotenv.config();
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// --- NEW ROUTES ADDED HERE BY eshan ---
app.use("/api/campaigns", eCampaignRoutes);
app.use("/api/events", eEventRoutes);
app.use("/api/registrations", eRegistrationRoutes);
app.use("/api/feedbacks", eFeedbackRoutes);

// Quiz routes
app.use("/api/quizzes", QMQuizRoutes);
app.use("/api/student/quiz", QMStudentQuizRoutes);
app.use("/api/questions", QMQuestionRoutes);

// AI Explanation routes
app.use("/api/ai", QMAiRoutes);

//report routes
app.use("/api/reports", reportRoutes);
app.use("/api/support/articles", supportArticleRoutes);
app.use("/api/support", supportChatRoutes);

// Course, Lesson, and Enrollment routes
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
