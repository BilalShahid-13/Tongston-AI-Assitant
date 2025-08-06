"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
    fileUrls: {
        type: [String], // Store uploaded file URLs or paths
        default: [],
    },
    message: {
        type: String,
        required: true,
        minlength: 10,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    otherCategoryDetail: {
        type: String,
        trim: true,
    },
    image: { type: Buffer },
}, {
    timestamps: true, // adds createdAt and updatedAt
});
// Prevent model overwrite in dev
exports.Feedback = mongoose_1.models.Feedback || (0, mongoose_1.model)("Feedback", feedbackSchema);
