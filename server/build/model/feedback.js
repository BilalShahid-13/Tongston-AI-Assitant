"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FileMetaSchema = new mongoose_1.Schema({
    filename: { type: String, required: true },
    url: { type: String },
    mimetype: { type: String },
    size: { type: Number },
}, { _id: false });
const FeedbackSchema = new mongoose_1.Schema({
    // Step 1
    subject: { type: String, required: true, trim: true },
    yearClassLevel: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    followUp: { type: Boolean, default: false },
    email: { type: String, trim: true, lowercase: true, sparse: true, index: true },
    // Step 2
    sectionReferringTo: { type: String, required: true },
    otherSectionDetail: { type: String },
    // Step 3
    feedbackCategory: {
        type: String,
        enum: ["positive", "issue", "suggestion"],
        required: true,
    },
    positiveMessage: { type: String },
    // Issue specific
    issueDescription: { type: String },
    issueScreenshot: { type: [FileMetaSchema], default: [] },
    problemOccurredAt: { type: String },
    otherProblemOccurredAtDetail: { type: String },
    issueCheckboxes: { type: [String], default: [] },
    issueDetails: { type: String },
    // Suggestion specific
    suggestionType: { type: String },
    otherSuggestionTypeDetail: { type: String },
    suggestionMessage: { type: String },
    suggestionAppearance: { type: String },
    suggestionScreenshot: { type: [FileMetaSchema], default: [] },
    inspirationUrl: { type: String, trim: true },
    // optional metadata
    meta: {
        ip: { type: String },
        userAgent: { type: String },
    },
}, {
    timestamps: true,
});
// Useful indexes
FeedbackSchema.index({ email: 1 });
FeedbackSchema.index({ feedbackCategory: 1, createdAt: -1 });
const FeedbackModel = mongoose_1.default.model("Feedback", FeedbackSchema);
exports.default = FeedbackModel;
