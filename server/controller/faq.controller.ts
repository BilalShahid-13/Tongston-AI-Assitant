import { config } from "dotenv";
import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import {
  extractFileId,
  extractFolderId,
  processSinglePdf,
} from "../lib/extractFileId";
import { listPdfFilesInFolder } from "../lib/googleDriveDriver";
import { faqsInstructions } from "../templates/prompts";
import { parseExcelLink } from "../utils/parseExcelFile";
import { faqSimilaritySearch } from "../utils/similaritySearch";

config();

export async function getFaq(req: Request, res: Response): Promise<void> {
  try {
    // const query = req.body.query || req.query.q;
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({ error: "Missing query parameter" });
      return;
    }
    await faqSimilaritySearch(req, query, res, faqsInstructions);

    // const db = client.db();
    // const collection = db.collection("faqs");

    // const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    //   collection,
    //   indexName: "faq_index",
    //   textKey: "content",
    //   embeddingKey: "vector",
    // });

    // const results = await vectorStore.similaritySearch(query, 5);
    // const context = results.map((doc) => doc.pageContent).join("\n");

    // const previousMessages = req.body.history || []; // Expects [{ role: 'user' | 'assistant', content: string }]

    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Cache-Control", "no-cache");
    // res.setHeader("Connection", "keep-alive");

    // const messages = [
    //   {
    //     role: "system",
    //     content: faqsInstructions(context, query),
    //   },
    //   ...previousMessages,
    //   {
    //     role: "user",
    //     content: query,
    //   },
    // ];

    // const stream = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages,
    //   temperature: 0.7,
    //   stream: true,
    // });

    // for await (const chunk of stream) {
    //   const content = chunk.choices?.[0]?.delta?.content;
    //   if (content) {
    //     res.write(`data: ${content}\n\n`);
    //   }
    // }

    // res.write(`data: [END]\n\n`);
    // res.end();
  } catch (error) {
    console.error("❌ Error in getFaq:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function insertFaq(req: Request, res: Response) {
  try {
    const links: string[] = parseExcelLink(
      "./public/AI Chatbot (K12) Knowledge base sort sheet.xlsx",
    );

    const db = await connectMongo();

    for (const link of links) {
      const isPdfLink = link.includes("/view");
      const isFolderLink = link.includes("/folders/");

      if (isPdfLink) {
        const fileId = extractFileId(link);
        await processSinglePdf(fileId);
      } else if (isFolderLink) {
        const folderId = extractFolderId(link);
        const pdfFileIds = await listPdfFilesInFolder(folderId);
        for (const pdfId of pdfFileIds) {
          await processSinglePdf(pdfId);
        }
      } else {
        console.warn(`⚠️ Unknown link format: ${link}`);
      }
    }

    res.status(200).json({ message: "FAQs inserted successfully." });
  } catch (error) {
    console.error("❌ Error inserting FAQ:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
