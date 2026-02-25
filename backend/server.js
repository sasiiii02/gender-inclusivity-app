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

import reportRoutes from "./routes/reportRoutes.js"; // Import the report routes
import chatRoutes from "./routes/chatRoute.js"; // Import the chat routes
import supportArticleRoutes from "./routes/supportArticleRoutes.js";

dotenv.config();
connectDb();

const app= express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

// --- NEW ROUTES ADDED HERE BY eshan ---
app.use("/api/campaigns", eCampaignRoutes);
app.use("/api/events", eEventRoutes);
app.use("/api/registrations", eRegistrationRoutes);

//report routes
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/support/articles", supportArticleRoutes);

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})