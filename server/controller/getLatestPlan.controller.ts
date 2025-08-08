import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import { History } from "../model/userHistorySchema";
import { User } from "../model/user";

const planList = [
  "projectTaskFacilitationPlan",
  "projectTaskPlan",
  "reportGenerator",
  "studentConductCharacterAssessmentPlan",
  "studentConductCharacterPlan",
  "subjectAssessmentPlan",
  "subjectLessonPlan"
];

export async function getLatestPlan(req: Request, res: Response): Promise<void> {
  try {
    const { planName } = req.body;

    if (typeof planName !== "string" || !planList.includes(planName)) {
      res.status(400).json({ error: "Invalid plan name" });
      return;
    }

    await connectMongo();

    const latestPlan = await History.findOne({ plan: planName })
      .select("-fields").populate({
        path: "userId",
        model: User,
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Success", data: latestPlan || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
