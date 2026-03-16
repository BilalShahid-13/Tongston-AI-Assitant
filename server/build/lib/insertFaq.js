"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertFaq = insertFaq;
const textsplitters_1 = require("@langchain/textsplitters");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const connectDb_1 = require("../lib/connectDb");
const openai_1 = require("../lib/openai");
const faqKnowledgeBase_1 = require("../model/faqKnowledgeBase");
const parseExcelFile_1 = require("../utils/parseExcelFile");
const googleDriveDriver_1 = require("./googleDriveDriver");
(0, dotenv_1.config)();
const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(uri);
let db;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const extractFileId = (link) => {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
};
const extractFolderId = (link) => {
    const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
};
const downloadDriveFile = async (fileId) => {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await axios_1.default.get(url, { responseType: "arraybuffer", timeout: 60000 });
    return Buffer.from(response.data);
};
// const listPdfFilesInFolder = async (folderId: string): Promise<string[]> => {
//   // TODO: Replace with Google Drive API logic
//   return ["pdfFileId1", "pdfFileId2"];
// };
async function pdfToText(buffer) {
    const data = await (0, pdf_parse_1.default)(buffer);
    return data.text;
}
// async function processSinglePdf(fileId: string) {
//   const pdfBuffer = await downloadDriveFile(fileId);
//   const content = await pdfToText(pdfBuffer);
//   const chunks = await splitter.splitText(content);
//   for (const chunk of chunks) {
//     const embedding = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: chunk,
//       encoding_format: "float",
//     });
//     const vector = embedding.data[0].embedding;
//     await Faq.create({
//       fileId:fileId,
//       chunkIndex: i,
//       content: chunk,
//       vector,
//     });
//   }
// }
async function processSinglePdf(fileId) {
    const pdfBuffer = await downloadDriveFile(fileId);
    const content = await pdfToText(pdfBuffer);
    const chunks = await splitter.splitText(content);
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const exists = await faqKnowledgeBase_1.faqKnowledgeBase.exists({ fileId, chunkIndex: i });
        if (exists) {
            console.log(`⏩ Skipping chunk ${i} of file ${fileId} (already in DB)`);
            continue;
        }
        const vector = await (0, openai_1.embedQuery)(chunk); // ✅ official Gemini SDK
        // const embedding = await openai.embeddings.create({
        //   model: "text-embedding-3-small",
        //   input: chunk,
        //   encoding_format: "float",
        // });
        // const vector = embedding.data[0].embedding;
        await faqKnowledgeBase_1.faqKnowledgeBase.create({
            fileId,
            chunkIndex: i,
            content: chunk,
            vector,
        });
        console.log(`✅ Inserted chunk ${i} of file ${fileId}`);
    }
}
async function insertFaq() {
    try {
        const links = (0, parseExcelFile_1.parseExcelLink)("./public/AI Chatbot (K12) Knowledge base sort sheet.xlsx");
        const db = await (0, connectDb_1.connectMongo)();
        for (const link of links) {
            const isPdfLink = link.includes("/view");
            const isFolderLink = link.includes("/folders/");
            if (isPdfLink) {
                const fileId = extractFileId(link);
                await processSinglePdf(fileId);
            }
            else if (isFolderLink) {
                const folderId = extractFolderId(link);
                const pdfFileIds = await (0, googleDriveDriver_1.listPdfFilesInFolder)(folderId);
                for (const pdfId of pdfFileIds) {
                    await processSinglePdf(pdfId);
                }
            }
            else {
                console.warn(`⚠️ Unknown link format: ${link}`);
            }
        }
        // res.status(200).json({ message: "FAQs inserted successfully." });
        console.log("FAQs inserted successfully");
    }
    catch (error) {
        console.error("❌ Error inserting FAQ:", error);
        // res.status(500).json({ error: "Internal Server Error" });
    }
}
