import { Router, Request, Response } from "express";
import { getDB } from "../db";

const router = Router();

// GET /api/skills - Master list of all skills grouped by category
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const skills = await db.collection("skills").find({}).sort({ category: 1, name: 1 }).toArray();
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch skills" });
  }
});

// POST /api/skills/extract - Smart Skill Extractor from Resume / Bio text
router.post("/extract", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text string is required for extraction" });
    }

    const db = getDB();
    const allSkills = await db.collection("skills").find({}).toArray();

    const normalizedText = text.toLowerCase();
    const detectedSkills: Array<{ name: string; category: string; suggestedLevel: number }> = [];

    for (const skill of allSkills) {
      const skillName = skill.name.toLowerCase();
      // Look for full word or symbol matches
      const regex = new RegExp(`\\b${skillName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      
      // Also handle common synonyms
      const match = regex.test(normalizedText) ||
        (skillName === "react" && normalizedText.includes("reactjs")) ||
        (skillName === "node.js" && (normalizedText.includes("nodejs") || normalizedText.includes("node js"))) ||
        (skillName === "mongodb" && normalizedText.includes("mongo")) ||
        (skillName === "docker" && normalizedText.includes("containerization"));

      if (match) {
        // Estimate a default proficiency of 3 (competent) for detected skills
        detectedSkills.push({
          name: skill.name,
          category: skill.category,
          suggestedLevel: 3,
        });
      }
    }

    res.json({
      extractedCount: detectedSkills.length,
      skills: detectedSkills,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to extract skills" });
  }
});

export default router;
