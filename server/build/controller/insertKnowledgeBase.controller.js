"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertKnowledgeBase = insertKnowledgeBase;
const textsplitters_1 = require("@langchain/textsplitters");
const mammoth_1 = __importDefault(require("mammoth"));
const openai_1 = __importDefault(require("../lib/openai"));
const pdfToText_1 = require("../lib/pdfToText");
const faqKnowledgeBase_1 = require("../model/faqKnowledgeBase");
const knowledgeBaseFiles_1 = require("../model/knowledgeBaseFiles"); // files collection
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const connectDb_1 = require("../lib/connectDb");
const textSplitter = new textsplitters_1.CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
async function insertKnowledgeBase(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const mimeType = req.file.mimetype;
        const fileType = mimeType.split("/")[1];
        let extractedText = "";
        if (fileType === "plain" || fileType === "txt") {
            extractedText = req.file.buffer.toString("utf-8");
        }
        else if (fileType === "pdf") {
            extractedText = await (0, pdfToText_1.pdfToText)(req.file.buffer);
        }
        else if (fileType === "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileType === "docx") {
            const result = await mammoth_1.default.extractRawText({ buffer: req.file.buffer });
            extractedText = result.value;
        }
        else {
            return res.status(400).json({ error: "Unsupported file type" });
        }
        await (0, connectDb_1.connectMongo)();
        const cloudinaryRes = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, req.file.originalname);
        // 3️⃣ Save file metadata
        const fileDoc = await knowledgeBaseFiles_1.knowledgeBaseFile.create({
            fileId: cloudinaryRes?.public_id,
            fileUrl: cloudinaryRes?.secure_url,
            fileType,
            originalName: req.file.originalname
        });
        // Step 2: Split into chunks
        const chunks = await textSplitter.splitText(extractedText);
        // Step 3: Generate embeddings for all chunks
        const embeddingRes = await openai_1.default.embeddings.create({
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
        await faqKnowledgeBase_1.faqKnowledgeBase.insertMany(chunkDocs);
        res.status(200).json({ message: "Success", inserted: chunkDocs.length });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
