import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import { faqHistory } from "../model/faqHistory";

export async function fetchFaqChats(req: Request, res: Response): Promise<void> {
  try {
    await connectMongo();
    let chatHistory = await faqHistory.find({});
    res.status(200).json({ message: "Success", data: chatHistory || [] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}