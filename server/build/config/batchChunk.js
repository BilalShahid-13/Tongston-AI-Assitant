"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTextWithTokenLimit = splitTextWithTokenLimit;
const tiktoken_1 = require("tiktoken");
// Initialize tokenizer for the model
const tokenizer = (0, tiktoken_1.encoding_for_model)("text-embedding-3-small");
async function splitTextWithTokenLimit(text, maxTokens = 8000) {
    const chunks = [];
    let currentChunk = "";
    let currentTokenCount = 0;
    const words = text.split(/\s+/);
    for (const word of words) {
        const wordTokens = tokenizer.encode(word).length;
        if (currentTokenCount + wordTokens > maxTokens) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
            currentTokenCount = wordTokens;
        }
        else {
            currentChunk += (currentChunk ? " " : "") + word;
            currentTokenCount += wordTokens;
        }
    }
    if (currentChunk)
        chunks.push(currentChunk.trim());
    return chunks.filter((chunk) => chunk.length > 0);
}
