"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectTaskPlan = getProjectTaskPlan;
const prompts_1 = require("../templates/prompts");
const similaritySearch_1 = require("../utils/similaritySearch");
async function getProjectTaskPlan(req, res) {
    try {
        const body = req.body;
        const requiredFields = [
            "location",
            "yearClass",
            "schoolLevel",
            "classSize",
            "timeAvailable",
            "term",
            "week",
            "technologyAccess",
            "teachingAids",
        ];
        const missingFields = requiredFields.filter(field => {
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
        await (0, similaritySearch_1.planSimilaritySearch)(req, body, res, prompts_1.projectTaskPlanPrompt);
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
