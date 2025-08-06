"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
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
exports.Faq = mongoose_1.models.Faq || (0, mongoose_1.model)("Faq", faqSchema);
