import { connectDB } from "./db";
import roles from "./data/roles.json";

async function seedRoles() {
  const db = await connectDB();
  await db.collection("targetRoles").deleteMany({});
  const result = await db.collection("targetRoles").insertMany(roles);
  console.log(`Inserted ${result.insertedCount} target roles`);
  process.exit(0);
}

seedRoles();