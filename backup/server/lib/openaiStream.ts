// utils/openai-stream.ts
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_URI });

export async function OpenAIStream(prompt: string, systemPrompt: string) {
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
