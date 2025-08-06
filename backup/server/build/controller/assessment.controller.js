"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAssessmentPlanKnowledgeBase = searchAssessmentPlanKnowledgeBase;
const connectDb_1 = require("../lib/connectDb");
const generateEmbedding_1 = require("../lib/generateEmbedding");
const openaiStream_1 = require("../lib/openaiStream");
const prompts_1 = require("../lib/prompts");
const cosineSimilarity_1 = require("../utils/cosineSimilarity");
const openai_1 = __importDefault(require("../lib/openai"));
async function generateFallbackResponse(query) {
    try {
        const completion = await openai_1.default.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: JSON.stringify(query),
            max_tokens: 150,
        });
        return completion.choices[0].text.trim();
    }
    catch (error) {
        throw new Error("Error generating fallback response: " + (error.message || error));
    }
}
async function searchAssessmentPlanKnowledgeBase(req, res) {
    const { assessmentType, location, schoolCurriculum, yearClass, schoolLevel, subSchoolLevel, studentAge, classesSocioEconoic, term, termTheme, subject, subjectDiscipline, subjectUnitTopic, subjectSubTopic, bloom, subjectLearning, timeAvailable, sen, noOfStudents, severity, supportProvide, PreferredCommuniation, mobility, sensory, socialInteraction, cognitive, medical, IEP, send, cbtTest, examination, totalQuesions, questionTypes, maxAnswer, answerProvided, nationalTest } = req.body;
    // Set headers for streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const requiredFields = {
        assessmentType,
        location,
        schoolCurriculum,
        yearClass,
        schoolLevel,
        subSchoolLevel,
        studentAge,
        // classesSocioEconoic,
        term,
        termTheme,
        subject,
        subjectDiscipline,
        subjectUnitTopic,
        bloom,
        // subjectLearning,
        timeAvailable,
        totalQuesions,
        questionTypes,
    };
    // Find missing fields
    const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);
    if (missingFields.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Missing required fields',
            missingFields
        });
    }
    try {
        const queryEmbedding = await (0, generateEmbedding_1.generateEmbedding)([
            assessmentType,
            location,
            schoolCurriculum,
            yearClass,
            schoolLevel,
            subSchoolLevel,
            studentAge,
            // classesSocioEconoic,
            term,
            termTheme,
            subject,
            subjectDiscipline,
            subjectUnitTopic,
            subjectSubTopic,
            bloom,
            subjectLearning,
            timeAvailable,
            sen,
            noOfStudents,
            severity,
            supportProvide,
            PreferredCommuniation,
            mobility,
            sensory,
            socialInteraction,
            cognitive,
            medical,
            IEP,
            send,
            cbtTest,
            examination,
            totalQuesions,
            questionTypes,
            maxAnswer,
            answerProvided,
            nationalTest
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
            res.end(); // Terminate the response stream
            return;
        }
        const similarites = documents.map((doc) => {
            const similarity = (0, cosineSimilarity_1.cosineSimilarity)(queryEmbedding, doc.embedding);
            return {
                ...doc,
                similarity,
            };
        });
        similarites.sort((a, b) => b.similarity - a.similarity);
        let prompt;
        if (similarites.length === 0 || similarites[0].similarity < 0.5) {
            prompt = await generateFallbackResponse({
                assessmentType,
                location,
                schoolCurriculum,
                yearClass,
                schoolLevel,
                subSchoolLevel,
                studentAge,
                // classesSocioEconoic,
                term,
                termTheme,
                subject,
                subjectDiscipline,
                subjectUnitTopic,
                bloom,
                subjectLearning,
                timeAvailable,
                totalQuesions,
                questionTypes,
            });
        }
        else {
            prompt = `
        Discipline: ${similarites[0].Discipline},
        type of assessment: ${assessmentType},
        location:${location},
        School Level:${schoolLevel},
        Sub School Level:${subSchoolLevel},
        Students Average Age (Years):${studentAge},
        Term:${term},
        Term Theme:${termTheme},
        Subject:${subject},
        Subject Dicipline:${subjectDiscipline},
        Subject Unit/Topic:${subjectUnitTopic},
        Subject Sub-Unit/Sub-Topic:${subjectUnitTopic},
        Subject Level of Difficulty for the Learning / Lesson Objectives (using Blooms Taxonomy):${bloom},
        Subject Learning/Lesson Objectives:${subjectLearning},
        timeAvailable:${timeAvailable},
        Total Number of Qustions/Activities:${totalQuesions},
        Types of Questions:${questionTypes},
        subject: ${similarites[0].Subjects},
        class: ${similarites[0].Class},
        Description: ${similarites[0].Description},
        source: ${similarites[0].source},`;
        }
        const stream = await (0, openaiStream_1.OpenAIStream)(prompt, prompts_1.assessmentPlanPrompt);
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
