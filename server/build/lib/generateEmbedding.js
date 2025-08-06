"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
const openai_1 = __importDefault(require("../lib/openai"));
async function generateEmbedding(text) {
    const response = await openai_1.default.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float"
    });
    return response.data[0].embedding;
}
