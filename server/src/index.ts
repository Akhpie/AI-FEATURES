import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());

// Connect to Database
connectDB();

app.use("/resuploads", (req, res, next) => {
  // Check if it's a download request
  if (req.query.download === "true") {
    // Set headers for download
    res.setHeader("Content-Disposition", "attachment");
  }
  next();
});

app.use("/resuploads", express.static(path.join(__dirname, "Resuploads")));

if (process.env.NODE_ENV === "development") {
  app.get("/api/debug/routes", (req, res) => {
    const routes = app._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({
        path: r.route.path,
        methods: Object.keys(r.route.methods),
      }));
    res.json(routes);
  });
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
