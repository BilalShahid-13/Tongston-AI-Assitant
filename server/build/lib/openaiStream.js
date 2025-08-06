"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIStream = OpenAIStream;
// utils/openai-stream.ts
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({ apiKey: process.env.OPEN_AI_URI });
async function OpenAIStream(prompt, systemPrompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
        ],
    });
    return completion; // This is an AsyncIterable
}
