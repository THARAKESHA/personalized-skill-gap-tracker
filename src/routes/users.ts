import { Router, Request, Response } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";
const router = Router();
router.post("/", async (req: Request, res: Response) => {
  const db = getDB();
   const newUser = {
    name: req.body.name,
    skills: req.body.skills,
    targetRoleId: req.body.targetRoleId ? new ObjectId(req.body.targetRoleId) : null,
    createdAt: new Date(),
  };
  const result = await db.collection("users").insertOne(newUser);
  res.json({ message: "User created", userId: result.insertedId });
});
router.get("/", async (req: Request, res: Response) => {
  const db = getDB();
  const users = await db.collection("users").find({}).toArray();
  res.json(users);
});
router.get("/:id", async (req: Request, res: Response) => {
  const db = getDB();
  const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
  res.json(user);
});
router.put("/:id", async (req: Request, res: Response) => {
  const db = getDB();
  const updateFields: any = {};
  if (req.body.name) updateFields.name = req.body.name;
  if (req.body.email) updateFields.email = req.body.email;
  if (req.body.skills) updateFields.skills = req.body.skills;
  if (req.body.targetRoleId) updateFields.targetRoleId = new ObjectId(req.body.targetRoleId);
  updateFields.updatedAt = new Date();

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: updateFields }
  );
  res.json({ message: "User updated", modifiedCount: result.modifiedCount });
});
router.delete("/:id", async (req: Request, res: Response) => {
  const db = getDB();
  const result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "User deleted", deletedCount: result.deletedCount });
});
export default router;