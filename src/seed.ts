import { connectDB } from "./db";
import roles from "./data/roles.json";
import skills from "./data/skills.json";
import recommendations from "./data/recommendations.json";
import sampleUsers from "./data/users.json";

async function seedAll() {
  try {
    const db = await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // 1. Target Roles
    await db.collection("targetRoles").deleteMany({});
    const roleResult = await db.collection("targetRoles").insertMany(roles);
    console.log(`✓ Inserted ${roleResult.insertedCount} CS target roles`);

    // 2. Skills Taxonomy & Text Index
    await db.collection("skills").deleteMany({});
    const skillResult = await db.collection("skills").insertMany(skills);
    await db.collection("skills").createIndex({ name: "text", category: "text", description: "text" });
    console.log(`✓ Inserted ${skillResult.insertedCount} master skills with text index`);

    // 3. Learning Recommendations
    await db.collection("recommendations").deleteMany({});
    const recResult = await db.collection("recommendations").insertMany(recommendations);
    await db.collection("recommendations").createIndex({ skillName: 1 });
    console.log(`✓ Inserted ${recResult.insertedCount} learning recommendations`);

    // 4. Sample Users (linking targetRoleId dynamically)
    await db.collection("users").deleteMany({});
    await db.collection("progressLogs").deleteMany({});

    const allRoles = await db.collection("targetRoles").find({}).toArray();
    const roleMap = new Map(allRoles.map((r) => [r.title, r._id]));

    const usersToInsert = sampleUsers.map((u) => ({
      name: u.name,
      email: u.email,
      skills: u.skills,
      targetRoleId: roleMap.get(u.targetRoleTitle) || null,
      createdAt: new Date(),
    }));

    const userResult = await db.collection("users").insertMany(usersToInsert);
    console.log(`✓ Inserted ${userResult.insertedCount} sample user profiles`);

    // 5. Initial progress logs for the sample users
    for (const [idx, id] of Object.entries(userResult.insertedIds)) {
      await db.collection("progressLogs").insertOne({
        userId: id,
        timestamp: new Date(),
        action: "INITIAL_ASSESSMENT",
        notes: "Profile created with initial self-assessment skills",
      });
    }
    console.log(`✓ Created initial progress logs for users`);

    console.log("\n=========================================");
    console.log("Database seeded successfully with all CS domains!");
    console.log("=========================================\n");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seedAll();
