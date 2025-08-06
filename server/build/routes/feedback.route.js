"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_controller_1 = require("../controller/feedback.controller");
const upload_1 = require("../middleware/upload");
const feedbackRouter = (0, express_1.Router)();
feedbackRouter.post("/insertFeedback", upload_1.upload.single("file"), feedback_controller_1.insertFeedback);
exports.default = feedbackRouter;
