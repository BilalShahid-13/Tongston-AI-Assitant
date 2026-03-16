"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadToCloudinary = (buffer, filename, folder = "knowledgeBase") => {
    return new Promise((resolve, reject) => {
        const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
        const stream = cloudinary_1.default.uploader.upload_stream({
            folder: `tongston/${folder}`, // ✅ No leading slashes
            public_id: `${Date.now()}-${nameWithoutExtension.replace(/\s+/g, "_")}`,
            resource_type: "auto"
        }, (error, result) => {
            if (error) {
                console.error("❌ Cloudinary upload error:", error);
                reject(error);
            }
            else if (result) {
                resolve(result);
            }
            else {
                reject(new Error("Upload failed: No result returned"));
            }
        });
        stream.end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
