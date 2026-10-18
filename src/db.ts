import { MongoClient, Db } from "mongodb";
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/skilltracker";
let db: Db;
export async function connectDB(): Promise<Db> {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log("Connected to MongoDB");
  return db;
}
export function getDB(): Db {
  return db;
}