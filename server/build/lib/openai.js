"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamChat = exports.embedQuery = void 0;
const openai_1 = __importDefault(require("openai"));
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// For chat completions
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
    // apiKey: process.env.OPENROUTER_API_KEY,
    // baseURL: "https://openrouter.ai/api/v1",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
// For embeddings — official SDK with output_dimensionality
const genAI = new genai_1.GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY });
const embedQuery = async (text) => {
    const result = await genAI.models.embedContent({
        model: "models/gemini-embedding-001",
        contents: text,
        config: { outputDimensionality: 1536 }, // ✅ match your MongoDB index
    });
    return result.embeddings[0].values;
};
exports.embedQuery = embedQuery;
// export const streamChat = async (model: string, messages: any[], temperature = 0.7, maxTokens?: number) => {
//   return genAI.models.generateContentStream({
//     model,
//     contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : m.role, parts: [{ text: m.content }] })),
//     config: { temperature, ...(maxTokens && { maxOutputTokens: maxTokens }) },
//   });
// };
const streamChat = async (model, messages, temperature = 0.7, maxTokens) => {
    return genAI.models.generateContentStream({
        model,
        contents: messages.map(m => ({
            role: m.role === 'assistant' || m.role === 'system' ? 'user' : m.role,
            parts: [{ text: m.content }]
        })),
        config: { temperature, ...(maxTokens && { maxOutputTokens: maxTokens }) },
    });
};
exports.streamChat = streamChat;
exports.default = openai;
