"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestPlan = getLatestPlan;
const connectDb_1 = require("../lib/connectDb");
const userHistorySchema_1 = require("../model/userHistorySchema");
const user_1 = require("../model/user");
const planList = [
    "projectTaskFacilitationPlan",
    "projectTaskPlan",
    "reportGenerator",
    "studentConductCharacterAssessmentPlan",
    "studentConductCharacterPlan",
    "subjectAssessmentPlan",
    "subjectLessonPlan"
];
async function getLatestPlan(req, res) {
    try {
        const { planName } = req.body;
        if (typeof planName !== "string" || !planList.includes(planName)) {
            res.status(400).json({ error: "Invalid plan name" });
            return;
        }
        await (0, connectDb_1.connectMongo)();
        const latestPlan = await userHistorySchema_1.History.findOne({ plan: planName })
            .select("-fields").populate({
            path: "userId",
            model: user_1.User,
        })
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Success", data: latestPlan || [] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
