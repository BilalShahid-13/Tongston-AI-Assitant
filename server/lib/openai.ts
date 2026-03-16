import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// For chat completions
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // apiKey: process.env.OPENROUTER_API_KEY,
  // baseURL: "https://openrouter.ai/api/v1",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// For embeddings — official SDK with output_dimensionality
const genAI = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const embedQuery = async (text: string): Promise<number[]> => {
  const result = await genAI.models.embedContent({
    model: "models/gemini-embedding-001",
    contents: text,
    config: { outputDimensionality: 1536 },  // ✅ match your MongoDB index
  });
  return result.embeddings![0].values!;
};

// export const streamChat = async (model: string, messages: any[], temperature = 0.7, maxTokens?: number) => {
//   return genAI.models.generateContentStream({
//     model,
//     contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : m.role, parts: [{ text: m.content }] })),
//     config: { temperature, ...(maxTokens && { maxOutputTokens: maxTokens }) },
//   });
// };
export const streamChat = async (model: string, messages: any[], temperature = 0.7, maxTokens?: number) => {
  return genAI.models.generateContentStream({
    model,
    contents: messages.map(m => ({
      role: m.role === 'assistant' || m.role === 'system' ? 'user' : m.role,
      parts: [{ text: m.content }]
    })),
    config: { temperature, ...(maxTokens && { maxOutputTokens: maxTokens }) },
  });
};

export default openai;