"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqHistory = void 0;
const mongoose_1 = require("mongoose");
// model
const faqHistorySchema = new mongoose_1.Schema({
    messages: [
        {
            role: { type: String, required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });
exports.faqHistory = mongoose_1.models.faqHistory || (0, mongoose_1.model)("faqHistory", faqHistorySchema);
