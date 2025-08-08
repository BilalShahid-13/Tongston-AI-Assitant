import { config } from "dotenv";
import { Router } from "express";
import { MongoClient } from "mongodb";
import { getLatestPlan } from "../controller/getLatestPlan.controller";
import { getUserPlans } from "../controller/planFiles.controller";
import { connectMongo } from "../lib/connectDb";

const userRouter = Router();
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db();
const collection = db.collection("users");
config();
userRouter.get("/getUser", async (req, res) => {
  try {
    await connectMongo();
    const result = await collection.find({}).toArray();
    res.status(200).json(result);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})
userRouter.get("/getPlanFiles", getUserPlans)
userRouter.post("/getLatestProjectTaskPlan", getLatestPlan);

export default userRouter