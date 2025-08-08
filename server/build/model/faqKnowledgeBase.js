"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqKnowledgeBase = void 0;
const mongoose_1 = require("mongoose");
const faqKnowledgeBaseSchema = new mongoose_1.Schema({
    fileId: {
        type: String,
        required: true
    },
    chunkIndex: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    vector: {
        type: [Number], // array of floats (embedding vector)
        required: true,
    },
}, {
    timestamps: true
});
exports.faqKnowledgeBase = mongoose_1.models.faqKnowledgeBase || (0, mongoose_1.model)("faqKnowledgeBase", faqKnowledgeBaseSchema);
