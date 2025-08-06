import { Request, Response } from "express";
import { Feedback } from "../model/feedback";
import { connectMongo } from "../lib/connectDb";

export async function insertFeedback(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectMongo();

    const { category, message, rating, otherCategoryDetail } = req.body;
    const fileBuffer = req.file?.buffer;

    const feedback = await Feedback.create({
      category,
      message,
      rating,
      otherCategoryDetail,
      image: fileBuffer,
    });

    // ✅ Don't return this, just call it
    res
      .status(201)
      .json({ success: true, message: "Feedback submitted", data: feedback });
  } catch (error: any) {
    console.error("Error inserting feedback:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
