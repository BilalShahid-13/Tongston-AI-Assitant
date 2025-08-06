"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLessonPlanKnowledgeBase = searchLessonPlanKnowledgeBase;
const connectDb_1 = require("../lib/connectDb");
const generateEmbedding_1 = require("../lib/generateEmbedding");
const openai_1 = __importDefault(require("../lib/openai"));
const openaiStream_1 = require("../lib/openaiStream");
const prompts_1 = require("../lib/prompts");
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, aVal, index) => sum + aVal * b[index]);
    const normA = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
    const normB = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
    return dotProduct / (normA * normB);
}
async function generateFallbackResponse(query) {
    try {
        const completion = await openai_1.default.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: query,
            max_tokens: 150,
        });
        return completion.choices[0].text.trim();
    }
    catch (error) {
        throw new Error("Error generating fallback response: " + (error.message || error));
    }
}
async function searchLessonPlanKnowledgeBase(req, res) {
    const { query, bloomLevel, classSize, classesSocioEconomic, curriculum, location, schoolLevel, studentAge, subSchoolLevel, subject, subjectDicipline, term, termTheme, timeAvailable, week, yearClass, } = req.body;
    // Set headers for streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
        const queryEmbedding = await (0, generateEmbedding_1.generateEmbedding)([
            bloomLevel,
            classSize,
            classesSocioEconomic,
            curriculum,
            location,
            schoolLevel,
            studentAge,
            subSchoolLevel,
            subject,
            subjectDicipline,
            term,
            termTheme,
            timeAvailable,
            week,
            yearClass,
        ]
            .filter(Boolean)
            .join(" "));
        const collection = await (0, connectDb_1.connectMongo)();
        const documents = await collection.find({}).toArray();
        if (documents.length === 0) {
            res.status(404);
            res.write(`data: ${JSON.stringify({
                error: "No documents found in the collection",
            })}\n\n`);
            res.end();
            return;
        }
        const similarites = documents.map((doc) => {
            const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
            return {
                ...doc,
                similarity,
            };
        });
        similarites.sort((a, b) => b.similarity - a.similarity);
        let prompt;
        if (similarites.length === 0 || similarites[0].similarity < 0.5) {
            prompt = query;
        }
        else {
            prompt = `
        Discipline: ${similarites[0].Discipline},
        subject: ${similarites[0].Subjects},
        class: ${similarites[0].Class},
        Description: ${similarites[0].Description},
        source: ${similarites[0].source},`;
        }
        const stream = await (0, openaiStream_1.OpenAIStream)(prompt, prompts_1.lessonPlanPrompt);
        for await (const chunk of stream) {
            // Write each streamed chunk to the response
            res.write(chunk.choices?.[0]?.delta?.content || "");
        }
        res.end();
    }
    catch (error) {
        res.status(500);
        res.write(`data: ${JSON.stringify({
            error: "Server error during search: " + (error.message || "Unknown error"),
        })}\n\n`);
        res.end(); // Important: Terminate the response stream on error
    }
}
