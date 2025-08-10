"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeBase = void 0;
// models/knowledgeBase.ts
const mongoose_1 = require("mongoose");
const knowledgeBaseSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.knowledgeBase = mongoose_1.models.knowledgeBase || (0, mongoose_1.model)("knowledgeBase", knowledgeBaseSchema);
