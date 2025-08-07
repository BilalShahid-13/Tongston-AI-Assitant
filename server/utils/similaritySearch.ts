import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import openai from "../lib/openai";
import { chatHistory } from "./globalChatHistory";

config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const embeddings = new OpenAIEmbeddings();

const db = client.db();
const collection = db.collection("faqs");

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection,
  indexName: "faq_index",
  textKey: "content",
  embeddingKey: "vector",
});

export async function faqSimilaritySearch(req: Request, query: string, res: Response, instructionFn: (context: string, query: string) => string
) {
  const results = await vectorStore.similaritySearch(query, 10);
  const context = results.map((doc) => doc.pageContent).join("\n");

  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN_URL!);
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  chatHistory.push({ role: "user", content: query });
  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    // messages: [
    //   {
    //     role: "system",
    //     content: instructionFn(context, query),
    //   },
    //   {
    //     role: "user",
    //     content: query,
    //   },
    // ],
    messages: [
      { role: "system", content: instructionFn(context, query) },
      ...chatHistory,
    ],
    temperature: 0.7,
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      res.write(`data: ${content}\n\n`);
    }
  }
  res.write(`data: [END]\n\n`);
  res.end();
  chatHistory.push({ role: "assistant", content: fullResponse });
}

// other plans like assessment plan
export async function planSimilaritySearch(
  req: Request,
  query: Record<string, any>,
  res: Response,
  instructionFn: (context: Record<string, any>) => string // should return string
): Promise<void> {
  try {
    const results = await vectorStore.similaritySearch(JSON.stringify(query), 10);
    const context = results.map((doc) => doc.pageContent).join("\n");
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: instructionFn(query),
        },
        {
          role: "user",
          content: "Generate a lesson plan based on the provided context and parameters.",
        },
      ],
      temperature: 0.7,
      stream: true,
    });

    // ✅ Set headers for streaming
    // res.setHeader("Content-Type", "text/plain; charset=utf-8");
    // res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        res.write(content); // ✅ No prefix, just raw content
      }
    }
    res.end();
  } catch (error: any) {
    console.error("❌ Error in planSimilaritySearch:", error);

    // ✅ Only send error if headers haven't already been sent
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // ✅ If already streaming, send error as SSE
      res.write(error.message);
      // res.write(`data: [DONE]\n\n`);
      res.end();
    }
  }
}
