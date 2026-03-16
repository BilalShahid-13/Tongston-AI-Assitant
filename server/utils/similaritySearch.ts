import { config } from "dotenv";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { connectMongo } from "../lib/connectDb";
import openai, { embedQuery, streamChat } from "../lib/openai";
import { faqHistory } from "../model/faqHistory";
import { History } from "../model/userHistorySchema";
import { chatHistory } from "./globalChatHistory";

config();

// const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
// const client = new MongoClient(uri);
// const embeddings = new OpenAIEmbeddings();

// const db = client.db();
// const model = "openrouter/hunter-alpha";
// const model = "meta-llama/llama-3.1-8b-instruct:free";
const model = "models/gemini-2.5-flash";
async function vectorSearch(queryText: string, limit = 10) {
  console.log("🔍 Running vectorSearch...");
  const collection = mongoose.connection.db!.collection("faqKnowledgeBase");
  const queryVector = await embedQuery(queryText);
  console.log("✅ Embedding done, querying MongoDB...");
  return collection.aggregate([
    {
      $vectorSearch: {
        index: "faq_index",
        path: "vector",
        queryVector,
        numCandidates: 100,
        limit,
      },
    },
    { $project: { content: 1, _id: 0 } },
  ]).toArray();
}

// const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//   collection,
//   indexName: "faq_index",
//   textKey: "content",
//   embeddingKey: "vector",
// });

export async function faqSimilaritySearch(req: Request, query: string, res: Response, instructionFn: (context: string, query: string) => string
) {
  await connectMongo();
  const results = await vectorSearch(query, 10);
  // const results = await vectorStore.similaritySearch(query, 10);
  const context = results.map((doc) => doc.pageContent).join("\n");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN_URL!);
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  // const stream = await openai.chat.completions.create({
  //   model: model,
  //   messages: [
  //     { role: "assistant", content: instructionFn(context, query) },
  //     // ...roleAndContentOnly,
  //     ...chatHistory,
  //   ],
  //   temperature: 0.7,
  //   stream: true,
  // });
  const stream = await streamChat(model, [
    { role: "assistant", content: instructionFn(context, query) },
    ...chatHistory,
  ]);
  // const stream = await streamChat("models/gemini-2.0-flash-lite", [
  //   { role: "assistant", content: instructionFn(context, query) },
  //   ...chatHistory,
  // ]);
  for await (const chunk of stream) {
    const content = chunk.text;
    // const content = chunk.choices?.[0]?.delta?.content;
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
  instructionFn: (context: Record<string, any>, knowledgeBase: string) => string, // should return string
  planName: string,
  metaData: string,
): Promise<void> {
  try {
    // const results = await vectorStore.similaritySearch(JSON.stringify(query), 10);
    const results = await vectorSearch(JSON.stringify(query), 10);
    const context = results.map((doc) => doc.pageContent).join("\n");
    // console.log('context', context)
    let fullResponse = "";
    // const stream = await openai.chat.completions.create({
    //   model: model,
    //   messages: [
    //     {
    //       role: "system",
    //       content: instructionFn(query, context),
    //     },
    //   ],
    //   temperature: 0.7,
    //   stream: true,
    //   max_tokens: 3000,
    // });
    const stream = await streamChat(model, [
      { role: "system", content: instructionFn(query, context) },
    ], 0.7, 3000);
    for await (const chunk of stream) {
      const content = chunk.text;
      // const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(content);
      }
    }
    try {
      await connectMongo();
      const history = await History.create({
        userId: new mongoose.Types.ObjectId("689452b9af9c2c6ff5e178e9"),
        fields: query,
        // fields: Array.isArray(query) ? query : Object.values(query).map(String),
        answer: fullResponse,
        plan: planName,
        metaData: metaData
      });
      console.log(history)
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
