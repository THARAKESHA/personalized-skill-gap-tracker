import express from "express";
import path from "path";
import { connectDB } from "./db";
import usersRouter from "./routes/users";
import targetRolesRouter from "./routes/targetRoles";
import skillGapRouter from "./routes/skillGap";
import skillsRouter from "./routes/skills";
import progressRouter from "./routes/progress";

const app = express();

app.use(express.json());

// Serve static frontend dashboard assets
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// API Routes
app.use("/api/users", usersRouter);
app.use("/api/roles", targetRolesRouter);
app.use("/api/skill-gap", skillGapRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/progress", progressRouter);

// System Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "Personalized Skill Gap Tracking & Recommendation Engine",
    database: "MongoDB v7",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Skill Gap Recognition Server running on http://localhost:${PORT}`);
    console.log(`Interactive Web UI accessible at http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});
