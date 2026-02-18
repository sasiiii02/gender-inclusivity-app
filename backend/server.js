import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";

dotenv.config();
connectDb();

const app= express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

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