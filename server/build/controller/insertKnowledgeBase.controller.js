"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertKnowledgeBase = insertKnowledgeBase;
exports.extractWebsiteController = extractWebsiteController;
exports.extractGoogleDocsController = extractGoogleDocsController;
const textsplitters_1 = require("@langchain/textsplitters");
const cheerio = __importStar(require("cheerio"));
const mammoth_1 = __importDefault(require("mammoth"));
const tiktoken_1 = require("tiktoken");
const batchChunk_1 = require("../config/batchChunk");
const connectDb_1 = require("../lib/connectDb");
const openai_1 = __importDefault(require("../lib/openai"));
const pdfToText_1 = require("../lib/pdfToText");
const faqKnowledgeBase_1 = require("../model/faqKnowledgeBase");
const knowledgeBaseFiles_1 = require("../model/knowledgeBaseFiles"); // files collection
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const chunkSize = 3000;
const textSplitter = new textsplitters_1.CharacterTextSplitter({
    chunkSize: chunkSize,
    chunkOverlap: 200,
});
async function insertKnowledgeBase(req, res) {
    try {
        console.log("📥 Received upload request");
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("📄 File:", req.file.originalname, req.file.mimetype);
        const mimeType = req.file.mimetype;
        const fileType = mimeType.split("/")[1];
        let extractedText = "";
        if (fileType === "plain" || mimeType === "text/plain") {
            extractedText = req.file.buffer.toString("utf-8");
        }
        else if (fileType === "pdf" || mimeType === "application/pdf") {
            extractedText = await (0, pdfToText_1.pdfToText)(req.file.buffer);
        }
        else if (fileType === "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth_1.default.extractRawText({ buffer: req.file.buffer });
            extractedText = result.value;
        }
        else {
            return res.status(400).json({ error: "Unsupported file type" });
        }
        console.log("✅ Text extracted, length:", extractedText.length);
        await (0, connectDb_1.connectMongo)();
        // ✅ Upload to Cloudinary
        console.log("☁️ Uploading to Cloudinary...");
        const cloudinaryRes = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, req.file.originalname, "knowledgeBase"); // ✅ Type it properly
        console.log("✅ Cloudinary upload successful:", cloudinaryRes.secure_url);
        // ✅ FIXED: Use correct cloudinary properties
        const fileDoc = await knowledgeBaseFiles_1.knowledgeBaseFile.create({
            fileId: cloudinaryRes.public_id, // ✅ Correct
            fileUrl: cloudinaryRes.secure_url, // ✅ Correct
            fileType,
            originalName: req.file.originalname // ✅ From req.file, not cloudinaryRes
        });
        console.log("📦 File metadata saved, ID:", fileDoc._id);
        // Split into chunks
        const chunks = await textSplitter.splitText(extractedText);
        console.log("✂️ Created", chunks.length, "chunks");
        // Generate embeddings
        console.log("🤖 Generating embeddings...");
        const embeddingRes = await openai_1.default.embeddings.create({
            model: "text-embedding-3-small",
            input: chunks
        });
        // Prepare chunk docs
        const chunkDocs = chunks.map((content, i) => ({
            fileId: fileDoc._id,
            chunkIndex: i,
            content,
            vector: embeddingRes.data[i].embedding
        }));
        // Insert chunks
        await faqKnowledgeBase_1.faqKnowledgeBase.insertMany(chunkDocs);
        console.log("✅ Inserted", chunkDocs.length, "chunks into database");
        res.status(200).json({
            message: "Success",
            inserted: chunkDocs.length,
            fileUrl: cloudinaryRes.secure_url
        });
    }
    catch (error) {
        console.error("❌ Error in insertKnowledgeBase:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}
async function extractWebsiteController(req, res) {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });
        if (!response.ok) {
            return res.status(response.status).json({
                error: `Failed to fetch: ${response.status} ${response.statusText}`,
            });
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        // Remove unwanted elements
        $("script, style, nav, header, footer, aside").remove();
        // Extract plain text
        const text = $("body").text().replace(/\s+/g, " ").trim();
        if (!text) {
            return res.status(400).json({ error: "No readable content extracted from website" });
        }
        return res.json({ success: true, content: text });
    }
    catch (error) {
        console.error("Website extraction error:", error.message || error);
        return res.status(500).json({ error: "Failed to extract website content" });
    }
}
async function extractGoogleDocsController(req, res) {
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
        const cloudinaryRes = (await (0, uploadToCloudinary_1.uploadToCloudinary)(buffer, safeFilename, "knowledgeBase"));
        await (0, connectDb_1.connectMongo)();
        // Save file metadata in MongoDB
        await knowledgeBaseFiles_1.knowledgeBaseFile.create({
            fileId: cloudinaryRes?.public_id,
            fileUrl: cloudinaryRes?.secure_url,
            fileType,
            originalName: docTitle,
        });
        // Split and sanitize chunks
        const rawChunks = await (0, batchChunk_1.splitTextWithTokenLimit)(text, chunkSize);
        const chunks = rawChunks.filter((c) => typeof c === "string" && c.trim().length > 0);
        const failedChunks = [];
        const tokenizer = (0, tiktoken_1.encoding_for_model)("text-embedding-3-small");
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
                const embeddingRes = await openai_1.default.embeddings.create({
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
            }
            catch (err) {
                console.error(`Embedding error for chunk ${i}:`, err);
                failedChunks.push(element);
            }
        }
        // Insert all embeddings in one go
        if (documentsToInsert.length > 0) {
            try {
                await faqKnowledgeBase_1.faqKnowledgeBase.insertMany(documentsToInsert);
                console.log(`Inserted ${documentsToInsert.length} embeddings into faqKnowledgeBase`);
            }
            catch (dbErr) {
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
    }
    catch (error) {
        console.error("Google Docs extraction error:", error.message || error);
        return res.status(500).json({
            error: "Failed to extract and upload Google Docs content. Please check if the document is public and accessible.",
        });
    }
}
