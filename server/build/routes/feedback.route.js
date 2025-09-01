"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_controller_1 = require("../controller/feedback.controller");
const upload_1 = __importDefault(require("../middleware/upload"));
const feedbackRouter = (0, express_1.Router)();
// feedbackRouter.post("/insertFeedback", upload.single("file"), insertFeedback);
feedbackRouter.post("/insertFeedback", upload_1.default.fields([
    { name: "issueScreenshot", maxCount: 5 },
    { name: "suggestionScreenshot", maxCount: 5 },
]), feedback_controller_1.insertFeedback);
feedbackRouter.get("/getFeedbackAdmin", feedback_controller_1.getFeedbackAdmin);
exports.default = feedbackRouter;
