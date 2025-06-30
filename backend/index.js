import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am comming from backend",
    success: true,
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
