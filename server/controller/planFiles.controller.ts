import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import { User } from "../model/user";
import { History } from "../model/userHistorySchema";

export async function getUserPlans(req: Request, res: Response): Promise<void> {
  try {
    await connectMongo();

    const plans = await History.find({})
      // .select("plan createdAt updatedAt userId")  // include only needed fields
      .populate({
        path: "userId",
        model: User,
        // select: "username subject role",
      })
      // .sort({ createdAt: -1 });

    if (plans.length > 0) {
      res.status(200).json({
        success: true,
        count: plans.length,
        data: plans,
      });
    } else {
      res.status(404).json({ success: false, message: "No plans found" });
    }
  } catch (error) {
    console.error("❌ Error in getUserPlans:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
