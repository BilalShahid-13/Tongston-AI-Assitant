import { CharacterTextSplitter } from "@langchain/textsplitters";
import * as cheerio from "cheerio";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import mammoth from "mammoth";
import { encoding_for_model } from "tiktoken";
import { splitTextWithTokenLimit } from "../config/batchChunk";
import { connectMongo } from "../lib/connectDb";
import openai from "../lib/openai";
import { pdfToText } from "../lib/pdfToText";
import { faqKnowledgeBase } from "../model/faqKnowledgeBase";
import { knowledgeBaseFile } from "../model/knowledgeBaseFiles"; // files collection
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const chunkSize = 3000;
const textSplitter = new CharacterTextSplitter({
  chunkSize: chunkSize,
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
    const cloudinaryRes: any = await uploadToCloudinary(req.file.buffer, req.file.originalname, "/knowledgeBase");

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

export async function extractWebsiteController(req: Request, res: Response) {
  try {
    const { url } = req.body
    if (!url) {
      return res.status(400).json({ error: "URL is required" })
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch: ${response.status} ${response.statusText}`,
      })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove unwanted elements
    $("script, style, nav, header, footer, aside").remove()

    // Extract plain text
    const text = $("body").text().replace(/\s+/g, " ").trim()

    if (!text) {
      return res.status(400).json({ error: "No readable content extracted from website" })
    }

    return res.json({ success: true, content: text })
  } catch (error: any) {
    console.error("Website extraction error:", error.message || error)
    return res.status(500).json({ error: "Failed to extract website content" })
  }
}


export async function extractGoogleDocsController(req: Request, res: Response) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const docId = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!docId) {
      return res.status(400).json({ error: "Invalid Google Docs URL" });
    }

    // Fetch HTML to extract document name
    const htmlResponse = await fetch(`https://docs.google.com/document/d/${docId}/edit`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await htmlResponse.text();
    const $ = cheerio.load(html);
    let docTitle = $("title").text() || docId;
    docTitle = docTitle.replace(" - Google Docs", "").replace(/\s+/g, "_");

    // Fetch plain text content
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const response = await fetch(exportUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch document: ${response.status} ${response.statusText}`,
      });
    }

    const text = await response.text();
    if (!text.trim()) {
      return res.status(400).json({ error: "Empty or invalid document content" });
    }

    // Final filename from doc title
    const filename = `${docTitle}.txt`;
    const fileType = "txt";
    const safeFilename = filename
      .replace(/[^\w\-\.]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const buffer = Buffer.from(text, "utf-8");

    // Upload to Cloudinary
    const cloudinaryRes = (await uploadToCloudinary(
      buffer,
      safeFilename,
      "knowledgeBase"
    )) as UploadApiResponse;

    await connectMongo();

    // Save file metadata in MongoDB
    await knowledgeBaseFile.create({
      fileId: cloudinaryRes?.public_id,
      fileUrl: cloudinaryRes?.secure_url,
      fileType,
      originalName: docTitle,
    });

    // Split and sanitize chunks
    const rawChunks = await splitTextWithTokenLimit(text, chunkSize);
    const chunks = rawChunks.filter((c) => typeof c === "string" && c.trim().length > 0);
    const failedChunks: string[] = [];
    const tokenizer = encoding_for_model("text-embedding-3-small");
    const documentsToInsert = [];
    // Process chunks for embedding
    for (let i = 0; i < chunks.length; i++) {
      const element = chunks[i];
      try {
        const tokenCount = tokenizer.encode(element).length;
        if (tokenCount > 8192) {
          failedChunks.push(element);
          console.warn(`Skipping chunk ${i} with ${tokenCount} tokens`);
          continue;
        }
        const embeddingRes = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: element,
        });

        // Prepare document for faqKnowledgeBase
        const embeddingDoc = {
          fileId: cloudinaryRes.public_id,
          chunkIndex: i,
          content: element,
          vector: embeddingRes.data[0].embedding,
        };
        documentsToInsert.push(embeddingDoc);
        console.log(`Prepared embedding for chunk ${i}:`, embeddingDoc);
      } catch (err) {
        console.error(`Embedding error for chunk ${i}:`, err);
        failedChunks.push(element);
      }
    }

    // Insert all embeddings in one go
    if (documentsToInsert.length > 0) {
      try {
        await faqKnowledgeBase.insertMany(documentsToInsert);
        console.log(`Inserted ${documentsToInsert.length} embeddings into faqKnowledgeBase`);
      } catch (dbErr:any) {
        console.error("Database insertion error:", dbErr);
        return res.status(500).json({
          error: "Failed to insert embeddings into database",
          details: dbErr?.message,
        });
      }
    }

    return res.json({
      success: true,
      content: text.trim(),
      fileName: safeFilename,
      warning: failedChunks.length > 0 ? `${failedChunks.length} chunks failed to process` : undefined,
    });
  } catch (error: any) {
    console.error("Google Docs extraction error:", error.message || error);
    return res.status(500).json({
      error: "Failed to extract and upload Google Docs content. Please check if the document is public and accessible.",
    });
  }
}