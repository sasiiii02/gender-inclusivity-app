import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";

import eCampaignRoutes from "./routes/eCampaignRoutes.js";
import eEventRoutes from "./routes/eEventRoutes.js";
import eRegistrationRoutes from "./routes/eRegistrationRoutes.js";
import eFeedbackRoutes from "./routes/eFeedbackRoutes.js";

import QMQuizRoutes from "./routes/QM-quizRoutes.js";
import QMStudentQuizRoutes from "./routes/QM-studentQuizRoutes.js";
import QMQuestionRoutes from "./routes/QM-questionRoutes.js";

import QMAiRoutes from "./routes/QM-aiRoutes.js";

import reportRoutes from "./routes/reportRoutes.js";
import supportArticleRoutes from "./routes/supportArticleRoutes.js";
import supportChatRoutes from "./routes/supportChatRoutes.js";

import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/campaigns", eCampaignRoutes);
app.use("/api/events", eEventRoutes);
app.use("/api/registrations", eRegistrationRoutes);
app.use("/api/feedbacks", eFeedbackRoutes);

app.use("/api/quizzes", QMQuizRoutes);
app.use("/api/student/quiz", QMStudentQuizRoutes);
app.use("/api/questions", QMQuestionRoutes);

app.use("/api/ai", QMAiRoutes);

app.use("/api/reports", reportRoutes);
app.use("/api/support/articles", supportArticleRoutes);
app.use("/api/support-articles", supportArticleRoutes);
app.use("/api/support", supportChatRoutes);

app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

export default app;
