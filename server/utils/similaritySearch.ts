import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { connectMongo } from "../lib/connectDb";
import openai from "../lib/openai";
import { faqHistory } from "../model/faqHistory";
import { History } from "../model/userHistorySchema";
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
  await connectMongo();
  const results = await vectorStore.similaritySearch(query, 10);
  const context = results.map((doc) => doc.pageContent).join("\n");
  // let chatHistory = await faqHistory.find({});
  // chatHistory
  // const roleAndContentOnly = chatHistory.flatMap(doc =>
  //   doc.messages.map((msg: any) => ({
  //     role: msg.role,
  //     content: msg.content
  //   }))
  // );
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN_URL!);
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "assistant", content: instructionFn(context, query) },
      // ...roleAndContentOnly,
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
  chatHistory.push({ role: "user", content: query });
  await faqHistory.create({
    messages: [
      { role: "assistant", content: fullResponse },
      { role: "user", content: query },
    ]
  });
}


// other plans like assessment plan
export async function planSimilaritySearch(
  req: Request,
  query: Record<string, any>,
  res: Response,
  instructionFn: (context: Record<string, any>) => string, // should return string
  planName: string,
  metaData: string,
): Promise<void> {
  try {
    const results = await vectorStore.similaritySearch(JSON.stringify(query), 10);
    const context = results.map((doc) => doc.pageContent).join("\n");
    let fullResponse = "";
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
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(content);
      }
    }
    try {
      await connectMongo();
      const history = await History.create({
        userId: new mongoose.Types.ObjectId("689452b9af9c2c6ff5e178e9"),
        fields: Array.isArray(query) ? query : Object.values(query).map(String),
        answer: fullResponse,
        plan: planName,
        metaData: metaData
      });
      if (history?.id) {
        // res.write(
        //   `\n[MONGO_DB_INSERT][FINAL_RESPONSE_START]${JSON.stringify({
        //     final: fullResponse,
        //     id: history.id,
        //   })}[FINAL_RESPONSE_END]\n`
        // );
      } else {
      }
    } catch (err) {
      console.error("❌ Error saving history:", err);
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
