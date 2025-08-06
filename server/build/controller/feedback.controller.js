"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertFeedback = insertFeedback;
const feedback_1 = require("../model/feedback");
const connectDb_1 = require("../lib/connectDb");
async function insertFeedback(req, res) {
    try {
        await (0, connectDb_1.connectMongo)();
        const { category, message, rating, otherCategoryDetail } = req.body;
        const fileBuffer = req.file?.buffer;
        const feedback = await feedback_1.Feedback.create({
            category,
            message,
            rating,
            otherCategoryDetail,
            image: fileBuffer,
        });
        // ✅ Don't return this, just call it
        res
            .status(201)
            .json({ success: true, message: "Feedback submitted", data: feedback });
    }
    catch (error) {
        console.error("Error inserting feedback:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
