"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadDriveFile = exports.extractFolderId = exports.extractFileId = void 0;
exports.processSinglePdf = processSinglePdf;
const textsplitters_1 = require("@langchain/textsplitters");
const axios_1 = __importDefault(require("axios"));
const faqKnowledgeBase_1 = require("../model/faqKnowledgeBase");
const openai_1 = require("./openai");
const pdfToText_1 = require("./pdfToText");
const extractFileId = (link) => {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
};
exports.extractFileId = extractFileId;
const extractFolderId = (link) => {
    const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
};
exports.extractFolderId = extractFolderId;
const downloadDriveFile = async (fileId) => {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await axios_1.default.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
};
exports.downloadDriveFile = downloadDriveFile;
const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
});
async function processSinglePdf(fileId) {
    const pdfBuffer = await (0, exports.downloadDriveFile)(fileId);
    const content = await (0, pdfToText_1.pdfToText)(pdfBuffer);
    const chunks = await splitter.splitText(content);
    for (const chunk of chunks) {
        // embeddings.embedQuery
        const vector = await (0, openai_1.embedQuery)(chunk);
        // const embedding = await openai.embeddings.create({
        //   model: "gemini-embedding-001",
        //   input: chunk,
        //   encoding_format: "float",
        // });
        // const vector = embedding.data[0].embedding;
        await faqKnowledgeBase_1.faqKnowledgeBase.insertOne({
            content: chunk,
            vector,
        });
    }
}
