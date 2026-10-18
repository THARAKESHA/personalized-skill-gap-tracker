import { Router, Request, Response } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";

const router = Router();

// GET /api/progress/:userId - Get historical progress logs for timeline chart
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const userId = new ObjectId(req.params.userId);

    const logs = await db
      .collection("progressLogs")
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch progress logs" });
  }
});

// POST /api/progress/:userId/level-up - Update a skill level and log snapshot
router.post("/:userId/level-up", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const userId = new ObjectId(req.params.userId);
    const { skillName, newLevel, notes } = req.body;

    if (!skillName || typeof newLevel !== "number" || newLevel < 1 || newLevel > 5) {
      return res.status(400).json({ error: "skillName and valid newLevel (1-5) are required" });
    }

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentSkills = user.skills || [];
    const existingIndex = currentSkills.findIndex(
      (s: any) => s.name.toLowerCase() === skillName.toLowerCase()
    );

    let oldLevel = 0;
    if (existingIndex >= 0) {
      oldLevel = currentSkills[existingIndex].level;
      currentSkills[existingIndex].level = newLevel;
    } else {
      currentSkills.push({ name: skillName, level: newLevel });
    }

    // Update user document
    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { skills: currentSkills, updatedAt: new Date() } }
    );

    // Insert progress log snapshot
    const logEntry = {
      userId,
      timestamp: new Date(),
      action: "SKILL_LEVEL_UP",
      skillName,
      oldLevel,
      newLevel,
      notes: notes || `Improved ${skillName} from level ${oldLevel} to ${newLevel}`,
    };

    await db.collection("progressLogs").insertOne(logEntry);

    res.json({
      message: "Skill updated successfully and progress logged",
      skillName,
      oldLevel,
      newLevel,
      updatedSkills: currentSkills,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to record skill progress" });
  }
});

export default router;
