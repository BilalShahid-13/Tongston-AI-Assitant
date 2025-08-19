"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportGenerator = getReportGenerator;
const prompts_1 = require("../templates/prompts");
const fileParser_1 = require("../utils/fileParser");
const similaritySearch_1 = require("../utils/similaritySearch");
async function getReportGenerator(req, res) {
    try {
        const { classType, term, termTheme, submittedOnTime, submittedViaCorrectChannel, directedToCorrectAuthority, associatedPBLTask, teacherNameOrID } = req.body;
        // ✅ Basic field validation
        if (!req.file || !classType || !term || !termTheme) {
            res.status(400).json({ error: "Missing required fields or file" });
            return;
        }
        // ✅ Parse the uploaded file from memory buffer
        const fileText = await (0, fileParser_1.parseUploadedFile)(req.file.buffer, req?.file?.originalname);
        // ✅ Stream GPT response
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        await (0, similaritySearch_1.planSimilaritySearch)(req, {
            classType,
            term,
            termTheme,
            submittedOnTime,
            submittedViaCorrectChannel,
            directedToCorrectAuthority,
            associatedPBLTask,
            teacherNameOrID,
            fileText
        }, res, prompts_1.reportGeneratorPrompt, "reportGeneratorPlan", "Report Generator Plan");
    }
    catch (error) {
        console.error("❌ Error in getReportGenerator:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
        else {
            res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
            res.end();
        }
    }
}
