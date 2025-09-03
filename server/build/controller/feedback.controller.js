"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertFeedback = insertFeedback;
exports.getFeedbackAdmin = getFeedbackAdmin;
const connectDb_1 = require("../lib/connectDb");
const feedback_1 = __importDefault(require("../model/feedback"));
async function insertFeedback(req, res) {
    try {
        await (0, connectDb_1.connectMongo)();
        const { subject, yearClassLevel, role, country, followUp, email, sectionReferringTo, otherSectionDetail, feedbackCategory, positiveMessage, issueDescription, problemOccurredAt, otherProblemOccurredAtDetail, issueCheckboxes, issueDetails, suggestionType, otherSuggestionTypeDetail, suggestionMessage, suggestionAppearance, inspirationUrl, } = req.body;
        const issueScreenshot = req.files?.issueScreenshot?.map((file) => ({
            filename: file.originalname || file.original_filename || "", // ensure always set
            url: file.path || file.secure_url,
            mimetype: file.mimetype,
            size: file.size,
        })) || [];
        const suggestionScreenshot = req.files?.suggestionScreenshot?.map((file) => ({
            filename: file.originalname || file.original_filename || "",
            url: file.path || file.secure_url,
            mimetype: file.mimetype,
            size: file.size,
        })) || [];
        const feedback = await feedback_1.default.create({
            subject,
            yearClassLevel,
            role,
            country,
            followUp: followUp === "true" || followUp === true,
            email: email || null,
            sectionReferringTo,
            otherSectionDetail,
            feedbackCategory,
            positiveMessage,
            issueDescription,
            issueScreenshot,
            problemOccurredAt,
            otherProblemOccurredAtDetail,
            issueCheckboxes,
            issueDetails,
            suggestionType,
            otherSuggestionTypeDetail,
            suggestionMessage,
            suggestionAppearance,
            suggestionScreenshot,
            inspirationUrl,
            meta: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
            },
        });
        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback,
        });
    }
    catch (error) {
        console.error("Error inserting feedback:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
async function getFeedbackAdmin(req, res) {
    try {
        await (0, connectDb_1.connectMongo)();
        const feedbacks = await feedback_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Feedbacks fetched successfully", data: feedbacks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
