import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import FeedbackModel from "../model/feedback";

export async function insertFeedback(req: Request, res: Response): Promise<void> {
  try {
    await connectMongo();

    const {
      subject,
      yearClassLevel,
      role,
      country,
      followUp,
      email,
      sectionReferringTo,
      otherSectionDetail,
      feedbackCategory,
      positiveMessage,
      issueDescription,
      problemOccurredAt,
      otherProblemOccurredAtDetail,
      issueCheckboxes,
      issueDetails,
      suggestionType,
      otherSuggestionTypeDetail,
      suggestionMessage,
      suggestionAppearance,
    } = req.body;

    const issueScreenshot =
      (req.files as any)?.issueScreenshot?.map((file: any) => ({
        filename: file.originalname || file.original_filename || "", // ensure always set
        url: file.path || file.secure_url,
        mimetype: file.mimetype,
        size: file.size,
      })) || [];

    const suggestionScreenshot =
      (req.files as any)?.suggestionScreenshot?.map((file: any) => ({
        filename: file.originalname || file.original_filename || "",
        url: file.path || file.secure_url,
        mimetype: file.mimetype,
        size: file.size,
      })) || [];

    const feedback = await FeedbackModel.create({
      subject,
      yearClassLevel,
      role,
      country,
      followUp: followUp === "true" || followUp === true,
      email: email || null,
      sectionReferringTo,
      otherSectionDetail,
      feedbackCategory,
      positiveMessage,
      issueDescription,
      issueScreenshot,
      problemOccurredAt,
      otherProblemOccurredAtDetail,
      issueCheckboxes,
      issueDetails,
      suggestionType,
      otherSuggestionTypeDetail,
      suggestionMessage,
      suggestionAppearance,
      suggestionScreenshot,
      meta: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error: any) {
    console.error("Error inserting feedback:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}


export async function getFeedbackAdmin(req: Request, res: Response): Promise<void> {
  try {
    await connectMongo();
    const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Feedbacks fetched successfully", data: feedbacks });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
}
