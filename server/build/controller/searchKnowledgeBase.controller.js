"use strict";
// import { Request, Response } from "express";
// import { connectMongo } from "../lib/connectDb";
// import { generateEmbedding } from "../lib/generateEmbedding";
// import openai from "../lib/openai";
// import { OpenAIStream } from "../lib/openaiStream";
// import { lessonPlanPrompt, promptTemplate } from "../lib/prompts";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLessonPlanKnowledgeBase = searchLessonPlanKnowledgeBase;
const connectDb_1 = require("../lib/connectDb");
const generateEmbedding_1 = require("../lib/generateEmbedding");
const openaiStream_1 = require("../lib/openaiStream");
const prompts_1 = require("../lib/prompts");
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, aVal, i) => sum + aVal * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
    const normB = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
    return dotProduct / (normA * normB);
}
async function searchLessonPlanKnowledgeBase(req, res) {
    const { query,
    // bloomLevel,
    // classSize,
    // classesSocioEconomic,
    // curriculum,
    // location,
    // schoolLevel,
    // studentAge,
    // subSchoolLevel,
    // subject,
    // subjectDicipline,
    // term,
    // termTheme,
    // timeAvailable,
    // week,
    // yearClass
     } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
        const inputText = [
        // const inputText = [
        // bloomLevel,
        // classSize,
        // classesSocioEconomic,
        // curriculum,
        // location,
        // schoolLevel,
        // studentAge,
        // subSchoolLevel,
        // subject,
        // subjectDicipline,
        // term,
        // termTheme,
        // timeAvailable,
        // week,
        // yearClass
        ].filter(Boolean).join(" ");
        const queryVector = await (0, generateEmbedding_1.generateEmbedding)(query);
        const db = await (0, connectDb_1.connectMongo)();
        const documents = await db.collection("tongton_ai_assistant_knowledge_base").aggregate([
            {
                $vectorSearch: {
                    index: "vector_index_2", // Your Atlas vector index name
                    path: "$vector", // Field storing embedding array
                    queryVector: queryVector, // The input embedding from OpenAI
                    numCandidates: 100, // How many to initially compare
                    limit: 5 // How many top results to return
                }
            },
            {
                $project: {
                    content: 1,
                    Discipline: 1,
                    Subject: 1,
                    YearClass: 1,
                    SubjectDescription: 1,
                    Link: 1
                    // Omit similarity if not supported in your tier
                }
            }
        ]).toArray();
        if (!documents.length) {
            res.status(404).write(`data: ${JSON.stringify({ error: "No documents found." })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }
        const ranked = documents.map(doc => ({
            ...doc,
            similarity: cosineSimilarity(queryVector, doc["$vector"]),
            content: doc.content,
            Discipline: doc.Discipline,
            Subject: doc.Subject,
            YearClass: doc.YearClass,
            SubjectDescription: doc.SubjectDescription,
            Link: doc.Link
        })).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
        const docContext = ranked.map(doc => doc.content).join("\n---\n");
        const bestMatch = ranked[0];
        const prompt = bestMatch.similarity < 0.5 ? query : `
Discipline: ${bestMatch.Discipline},
Subject: ${bestMatch.Subject},
Class: ${bestMatch.YearClass},
Description: ${bestMatch.SubjectDescription || "N/A"},
Source: ${bestMatch.Link || "N/A"}`.trim();
        const finalPrompt = (0, prompts_1.promptTemplate)(prompts_1.lessonPlanPrompt, docContext, prompt);
        const stream = await (0, openaiStream_1.OpenAIStream)(prompt, finalPrompt);
        for await (const chunk of stream) {
            res.write(chunk.choices?.[0]?.delta?.content || "");
        }
        res.write("data: [DONE]\n\n");
        res.end();
    }
    catch (error) {
        console.error("LessonPlan search error:", error.message || error);
        res.status(500).write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
    }
}
// export { searchLessonPlanKnowledgeBase };
