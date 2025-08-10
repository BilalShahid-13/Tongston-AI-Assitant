"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqSimilaritySearch = faqSimilaritySearch;
exports.planSimilaritySearch = planSimilaritySearch;
const mongodb_1 = require("@langchain/mongodb");
const openai_1 = require("@langchain/openai");
const dotenv_1 = require("dotenv");
const mongodb_2 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb_1 = require("../lib/connectDb");
const openai_2 = __importDefault(require("../lib/openai"));
const faqHistory_1 = require("../model/faqHistory");
const userHistorySchema_1 = require("../model/userHistorySchema");
(0, dotenv_1.config)();
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new mongodb_2.MongoClient(uri);
const embeddings = new openai_1.OpenAIEmbeddings();
const db = client.db();
const collection = db.collection("faqs");
const vectorStore = new mongodb_1.MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "faq_index",
    textKey: "content",
    embeddingKey: "vector",
});
async function faqSimilaritySearch(req, query, res, instructionFn) {
    await (0, connectDb_1.connectMongo)();
    const results = await vectorStore.similaritySearch(query, 10);
    const context = results.map((doc) => doc.pageContent).join("\n");
    let chatHistory = await faqHistory_1.faqHistory.find({});
    const roleAndContentOnly = chatHistory.flatMap(doc => doc.messages.map((msg) => ({
        role: msg.role,
        content: msg.content
    })));
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN_URL!);
    res.setHeader("Access-Control-Allow-Credentials", "false");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let fullResponse = "";
    const stream = await openai_2.default.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: instructionFn(context, query) },
            ...roleAndContentOnly,
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
    await faqHistory_1.faqHistory.create({
        messages: [
            { role: "assistant", content: fullResponse },
            { role: "user", content: query },
        ]
    });
}
// other plans like assessment plan
async function planSimilaritySearch(req, query, res, instructionFn, // should return string
planName, metaData) {
    try {
        const results = await vectorStore.similaritySearch(JSON.stringify(query), 10);
        const context = results.map((doc) => doc.pageContent).join("\n");
        let fullResponse = "";
        const stream = await openai_2.default.chat.completions.create({
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
            await (0, connectDb_1.connectMongo)();
            const history = await userHistorySchema_1.History.create({
                userId: new mongoose_1.default.Types.ObjectId("689452b9af9c2c6ff5e178e9"),
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
            }
            else {
            }
        }
        catch (err) {
            console.error("❌ Error saving history:", err);
        }
        res.end();
    }
    catch (error) {
        console.error("❌ Error in planSimilaritySearch:", error);
        // ✅ Only send error if headers haven't already been sent
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
        else {
            // ✅ If already streaming, send error as SSE
            res.write(error.message);
            // res.write(`data: [DONE]\n\n`);
            res.end();
        }
    }
}
