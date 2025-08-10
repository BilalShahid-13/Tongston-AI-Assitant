import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import { knowledgeBaseFile } from "../model/knowledgeBaseFiles";

export async function getKnowledgeBaseFile(req: Request, res: Response): Promise<void> {
  try {
    await connectMongo();
    const file = await knowledgeBaseFile.find({})

    res.status(200).json({ message: "Success", data: file || [] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function getKnowledgeBaseFileLength(req: Request, res: Response): Promise<void> {
  try {
    // your logic here
    await connectMongo();
    const file = await knowledgeBaseFile.countDocuments();
    res.status(200).json({ message: "Success", data: file || [] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}