"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectLessonPlan = getSubjectLessonPlan;
const prompts_1 = require("../templates/prompts");
const similaritySearch_1 = require("../utils/similaritySearch");
async function getSubjectLessonPlan(req, res) {
    try {
        const body = req.body;
        const compulsoryFields = [
            "location",
            "curriculum",
            "yearClass",
            "schoolLevel",
            "subSchoolLevel",
            "studentAge",
            "term",
            "termTheme",
            "week",
            "topic",
            "subject",
            "subjectDicipline",
            "bloomLevel",
            "classSize",
            "timeAvailable",
            "technologyAccess",
            "teachingAids"
        ];
        // ✅ Check missing fields BEFORE sending headers
        const missingFields = compulsoryFields.filter(field => {
            const value = body[field];
            if (field === "teachingAids")
                return !Array.isArray(value) || value.length === 0;
            return value === undefined || value === "";
        });
        if (missingFields.length > 0) {
            res.status(400).json({
                error: "Missing compulsory fields",
                missingFields,
            });
            return;
        }
        // ✅ Set headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        // ✅ Now start streaming
        await (0, similaritySearch_1.planSimilaritySearch)(req, body, res, prompts_1.lessonPlanPrompt);
    }
    catch (error) {
        console.error("❌ Error in getSubjectLessonPlan:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
        else {
            res.write(error?.message);
            res.end();
        }
    }
}
