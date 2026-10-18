import { Router, Request, Response } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";
const router = Router();
router.post("/", async (req: Request, res: Response) => {
  const db = getDB();
  const newRole = {
    title: req.body.title,
    domain: req.body.domain || "General Computer Science",
    description: req.body.description || "",
    requirements: req.body.requirements || [],
  };
  const result = await db.collection("targetRoles").insertOne(newRole);
  res.json({ message: "Target role created", roleId: result.insertedId });
});
router.get("/:id", async (req: Request, res: Response) => {
  const db = getDB();
  const role = await db.collection("targetRoles").findOne({ _id: new ObjectId(req.params.id) });
  res.json(role);
});
router.get("/", async (req: Request, res: Response) => {
  const db = getDB();
  const roles = await db.collection("targetRoles").find({}).toArray();
  res.json(roles);
});
export default router;