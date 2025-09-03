import { encoding_for_model } from "tiktoken";

// Initialize tokenizer for the model
const tokenizer = encoding_for_model("text-embedding-3-small");

export async function splitTextWithTokenLimit(text: string, maxTokens: number = 8000) {
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
    } else {
      currentChunk += (currentChunk ? " " : "") + word;
      currentTokenCount += wordTokens;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks.filter((chunk) => chunk.length > 0);
}