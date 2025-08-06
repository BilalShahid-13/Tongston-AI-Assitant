"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentPlan = getAssessmentPlan;
const similaritySearch_1 = require("../utils/similaritySearch");
const prompts_1 = require("../templates/prompts");
async function getAssessmentPlan(req, res) {
    try {
        const body = req.body;
        const compulsoryAssessmentPlanFields = [
            "assessmentType",
            "location",
            "schoolCurriculum",
            "yearClass",
            "schoolLevel",
            "subSchoolLevel",
            "studentAge",
            "classesSocioEconoic",
            "term",
            "termTheme",
            "subject",
            "subjectDiscipline",
            "subjectUnitTopic",
            "bloom",
            "subjectLearning",
            "timeAvailable",
            "PreferredCommuniation",
            "totalQuesions",
            "questionTypes",
            // "cassessmentWeek"
            "assessmentWeek"
        ];
        // ✅ Check for missing required fields
        const missingFields = compulsoryAssessmentPlanFields.filter(field => {
            const value = body[field];
            if (Array.isArray(value))
                return value.length === 0;
            return value === undefined || value === "";
        });
        if (missingFields.length > 0) {
            console.log("❌ Missing fields:", missingFields); // ADD THIS
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
        // ✅ Stream the generated assessment plan
        await (0, similaritySearch_1.planSimilaritySearch)(req, body, res, prompts_1.subjectAssessmentPrompt);
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
