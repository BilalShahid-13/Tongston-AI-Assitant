"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportGenerator_controller_1 = require("../controller/reportGenerator.controller");
const upload_1 = require("../middleware/upload");
const reportRouter = (0, express_1.Router)();
// reportRouter.post("/getReport", upload.single("lessonPlanFile"), getReportGenerator);
reportRouter.post("/getReport", (req, res, next) => {
    upload_1.upload.single("lessonPlanFile")(req, res, (err) => {
        if (err) {
            console.error("❌ Multer error:", err);
            return res.status(400).json({ error: "File upload failed", details: err.message });
        }
        next();
    });
}, reportGenerator_controller_1.getReportGenerator);
exports.default = reportRouter;
