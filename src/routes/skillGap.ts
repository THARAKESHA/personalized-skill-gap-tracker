import { Router, Request, Response } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";

const router = Router();

// Helper to compute readiness score given user skills and role requirements
function calculateRoleFit(userSkills: Array<{ name: string; level: number }>, requirements: any[]) {
  if (!requirements || requirements.length === 0) return 0;
  let earnedWeighted = 0;
  let maxWeighted = 0;

  const skillMap = new Map(userSkills.map((s) => [s.name.toLowerCase().trim(), s.level]));

  for (const req of requirements) {
    const weight = req.weight || 1;
    const required = req.requiredLevel || 1;
    const current = skillMap.get(req.name.toLowerCase().trim()) || 0;
    earnedWeighted += Math.min(current, required) * weight;
    maxWeighted += required * weight;
  }

  return maxWeighted > 0 ? Math.round((earnedWeighted / maxWeighted) * 100) : 0;
}

// GET /api/skill-gap/:userId - Full Personalized Gap Analysis & Multi-Role Fit
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const userId = new ObjectId(req.params.userId);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.targetRoleId) {
      return res.status(400).json({ error: "User has no target career role selected" });
    }

    const targetRole = await db.collection("targetRoles").findOne({ _id: user.targetRoleId });
    if (!targetRole) {
      return res.status(404).json({ error: "Target career role no longer exists in database" });
    }

    // 1. Aggregation pipeline to compute gaps and priority score
    const pipeline = [
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "targetRoles",
          localField: "targetRoleId",
          foreignField: "_id",
          as: "targetRole",
        },
      },
      { $unwind: "$targetRole" },
      { $unwind: "$targetRole.requirements" },
      {
        $addFields: {
          matchedSkill: {
            $first: {
              $filter: {
                input: { $ifNull: ["$skills", []] },
                as: "s",
                cond: { $eq: ["$$s.name", "$targetRole.requirements.name"] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          skill: "$targetRole.requirements.name",
          category: { $ifNull: ["$targetRole.requirements.category", "General"] },
          currentLevel: { $ifNull: ["$matchedSkill.level", 0] },
          targetLevel: "$targetRole.requirements.requiredLevel",
          weight: { $ifNull: ["$targetRole.requirements.weight", 1] },
        },
      },
      {
        $addFields: {
          gap: {
            $max: [{ $subtract: ["$targetLevel", "$currentLevel"] }, 0],
          },
        },
      },
      {
        $addFields: {
          priorityScore: { $multiply: ["$gap", "$weight"] },
          status: {
            $cond: {
              if: { $eq: ["$currentLevel", 0] },
              then: "Missing Skill",
              else: {
                $cond: {
                  if: { $gt: ["$gap", 0] },
                  then: "Needs Improvement",
                  else: "Benchmark Satisfied",
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "recommendations",
          localField: "skill",
          foreignField: "skillName",
          as: "learningResources",
        },
      },
      { $sort: { priorityScore: -1, gap: -1 } },
    ];

    const rawGaps = await db.collection("users").aggregate(pipeline).toArray();

    // 2. Compute Category Rollup
    const categoryRollup: Record<string, { totalGap: number; count: number; satisfiedCount: number }> = {};
    for (const g of rawGaps) {
      if (!categoryRollup[g.category]) {
        categoryRollup[g.category] = { totalGap: 0, count: 0, satisfiedCount: 0 };
      }
      categoryRollup[g.category].count += 1;
      categoryRollup[g.category].totalGap += g.gap;
      if (g.gap === 0) categoryRollup[g.category].satisfiedCount += 1;
    }

    // 3. Compute Career Readiness Score (0 - 100%)
    const readinessScore = calculateRoleFit(user.skills || [], targetRole.requirements || []);

    // 4. Multi-Role Fit: Calculate readiness against other CS roles
    const allRoles = await db.collection("targetRoles").find({ _id: { $ne: targetRole._id } }).toArray();
    const otherRoleFits = allRoles
      .map((r) => ({
        roleId: r._id,
        title: r.title,
        domain: r.domain,
        readinessScore: calculateRoleFit(user.skills || [], r.requirements || []),
      }))
      .sort((a, b) => b.readinessScore - a.readinessScore)
      .slice(0, 4);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        totalSkillsRecorded: (user.skills || []).length,
      },
      targetRole: {
        id: targetRole._id,
        title: targetRole.title,
        domain: targetRole.domain,
        description: targetRole.description,
        totalRequirements: (targetRole.requirements || []).length,
      },
      readinessScore,
      summary: {
        missingSkillsCount: rawGaps.filter((g) => g.currentLevel === 0).length,
        weakSkillsCount: rawGaps.filter((g) => g.currentLevel > 0 && g.gap > 0).length,
        satisfiedSkillsCount: rawGaps.filter((g) => g.gap === 0).length,
        totalPriorityPoints: rawGaps.reduce((acc, g) => acc + g.priorityScore, 0),
      },
      gaps: rawGaps,
      categoryRollup,
      otherRoleFits,
    });
  } catch (error: any) {
    console.error("Error computing skill gap:", error);
    res.status(500).json({ error: error.message || "Failed to compute skill gap" });
  }
});

// POST /api/skill-gap/simulate - "What-If" Skill Simulator (in-memory recalculation)
router.post("/simulate", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const { targetRoleId, simulatedSkills } = req.body;

    if (!targetRoleId || !simulatedSkills) {
      return res.status(400).json({ error: "targetRoleId and simulatedSkills are required" });
    }

    const role = await db.collection("targetRoles").findOne({ _id: new ObjectId(targetRoleId) });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    const readinessScore = calculateRoleFit(simulatedSkills, role.requirements || []);

    const skillMap = new Map(simulatedSkills.map((s: any) => [s.name.toLowerCase().trim(), s.level]));
    const gaps = (role.requirements || []).map((req: any) => {
      const current = skillMap.get(req.name.toLowerCase().trim()) || 0;
      const gap = Math.max(0, req.requiredLevel - current);
      const priorityScore = gap * (req.weight || 1);
      return {
        skill: req.name,
        category: req.category || "General",
        currentLevel: current,
        targetLevel: req.requiredLevel,
        gap,
        weight: req.weight || 1,
        priorityScore,
      };
    }).sort((a: any, b: any) => b.priorityScore - a.priorityScore);

    res.json({
      roleTitle: role.title,
      readinessScore,
      gaps,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Simulation failed" });
  }
});

export default router;