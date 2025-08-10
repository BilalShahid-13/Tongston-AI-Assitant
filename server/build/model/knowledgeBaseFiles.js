"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeBaseFile = void 0;
// models/knowledgeBaseFile.ts
const mongoose_1 = require("mongoose");
const knowledgeBaseFileSchema = new mongoose_1.Schema({
    fileId: { type: String, required: true }, // Cloudinary public_id
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    originalName: { type: String, required: true },
}, { timestamps: true });
exports.knowledgeBaseFile = mongoose_1.models.knowledgeBaseFile || (0, mongoose_1.model)("knowledgeBaseFile", knowledgeBaseFileSchema);
