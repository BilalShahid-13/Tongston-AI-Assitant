"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUploadedFile = parseUploadedFile;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
async function parseUploadedFile(fileBuffer, originalName) {
    const ext = originalName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
        const pdfData = await (0, pdf_parse_1.default)(fileBuffer);
        return pdfData.text;
    }
    if (ext === "docx") {
        const result = await mammoth_1.default.extractRawText({ buffer: fileBuffer });
        return result.value;
    }
    if (ext === "txt") {
        return fileBuffer.toString("utf-8");
    }
    throw new Error("Unsupported file type");
}
