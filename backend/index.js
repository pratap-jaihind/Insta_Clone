import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server, io } from "./socket/socket.js";
import path from "path";
dotenv.config();

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.URL, // For dev; use prod URL in deployment
    credentials: true,
  })
);

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve static frontend
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Frontend routing fallback (for React Router)
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
