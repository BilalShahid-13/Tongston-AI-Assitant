import { CharacterTextSplitter } from "@langchain/textsplitters";
import { Request, Response } from "express";
import mammoth from "mammoth";
import openai from "../lib/openai";
import { pdfToText } from "../lib/pdfToText";
import { faqKnowledgeBase } from "../model/faqKnowledgeBase";
import { knowledgeBaseFile } from "../model/knowledgeBaseFiles"; // files collection
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { connectMongo } from "../lib/connectDb";

const textSplitter = new CharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function insertKnowledgeBase(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const mimeType = (req.file as any).mimetype;
    const fileType = mimeType.split("/")[1];
    let extractedText = "";

    if (fileType === "plain" || fileType === "txt") {
      extractedText = req.file.buffer.toString("utf-8");
    } else if (fileType === "pdf") {
      extractedText = await pdfToText(req.file.buffer);
    } else if (
      fileType === "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "docx"
    ) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    await connectMongo();
    const cloudinaryRes: any = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    // 3️⃣ Save file metadata
    const fileDoc = await knowledgeBaseFile.create({
      fileId: cloudinaryRes?.public_id,
      fileUrl: cloudinaryRes?.secure_url,
      fileType,
      originalName: req.file.originalname
    });

    // Step 2: Split into chunks
    const chunks = await textSplitter.splitText(extractedText);

    // Step 3: Generate embeddings for all chunks
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks
    });

    // Step 4: Prepare chunk docs
    const chunkDocs = chunks.map((content, i) => ({
      fileId: fileDoc._id, // reference to file metadata
      chunkIndex: i,
      content,
      vector: embeddingRes.data[i].embedding
    }));

    // Step 5: Insert chunks into the correct collection
    await faqKnowledgeBase.insertMany(chunkDocs);

    res.status(200).json({ message: "Success", inserted: chunkDocs.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
