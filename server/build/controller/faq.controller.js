"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFaq = getFaq;
exports.insertFaq = insertFaq;
const dotenv_1 = require("dotenv");
const connectDb_1 = require("../lib/connectDb");
const extractFileId_1 = require("../lib/extractFileId");
const googleDriveDriver_1 = require("../lib/googleDriveDriver");
const prompts_1 = require("../templates/prompts");
const parseExcelFile_1 = require("../utils/parseExcelFile");
const similaritySearch_1 = require("../utils/similaritySearch");
const mongodb_1 = require("mongodb");
(0, dotenv_1.config)();
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(uri);
const db = client.db();
const collection = db.collection("faqKnowledgeBase");
async function getFaq(req, res) {
    try {
        // const query = req.body.query || req.query.q;
        const query = req.query.q;
        if (!query) {
            res.status(400).json({ error: "Missing query parameter" });
            return;
        }
        // db.collection("UserFaq")
        await (0, similaritySearch_1.faqSimilaritySearch)(req, query, res, prompts_1.faqsInstructions);
    }
    catch (error) {
        console.error("❌ Error in getFaq:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function insertFaq(req, res) {
    try {
        const links = (0, parseExcelFile_1.parseExcelLink)("./public/AI Chatbot (K12) Knowledge base sort sheet.xlsx");
        const db = await (0, connectDb_1.connectMongo)();
        for (const link of links) {
            const isPdfLink = link.includes("/view");
            const isFolderLink = link.includes("/folders/");
            if (isPdfLink) {
                const fileId = (0, extractFileId_1.extractFileId)(link);
                await (0, extractFileId_1.processSinglePdf)(fileId);
            }
            else if (isFolderLink) {
                const folderId = (0, extractFileId_1.extractFolderId)(link);
                const pdfFileIds = await (0, googleDriveDriver_1.listPdfFilesInFolder)(folderId);
                for (const pdfId of pdfFileIds) {
                    await (0, extractFileId_1.processSinglePdf)(pdfId);
                }
            }
            else {
                console.warn(`⚠️ Unknown link format: ${link}`);
            }
        }
        res.status(200).json({ message: "FAQs inserted successfully." });
    }
    catch (error) {
        console.error("❌ Error inserting FAQ:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
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
