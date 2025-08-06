"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPdfText = loadPdfText;
// loadPdfText.ts
const node_fetch_1 = __importDefault(require("node-fetch"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
async function loadPdfText(pdfUrl) {
    const res = await (0, node_fetch_1.default)(pdfUrl);
    const buffer = await res.arrayBuffer();
    const data = await (0, pdf_parse_1.default)(Buffer.from(buffer));
    return data.text;
    // const res = await fetch(pdfUrl);
    // const contentType = res.headers.get("content-type");
    // if (!res.ok || !contentType?.includes("application/pdf")) {
    //   const textPreview = await res.text();
    //   throw new Error(`Not a PDF file. Response type: ${contentType}, Preview: ${textPreview.slice(0, 200)}`);
    // }
    // const buffer = await res.buffer();
    // const data = await PdfParse(buffer);
    // return data.text;
}
