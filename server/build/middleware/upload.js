"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage(); // ✅ store file in memory as Buffer
exports.upload = (0, multer_1.default)({ storage });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const cloudinaryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => {
        const category = req.body.feedbackCategory || req.body.folder || "general";
        return {
            folder: `${category}`,
            // folder: `${process.env.FEEDBACK_FOLDER_NAME}/${category}`,
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
            resource_type: "auto",
        };
    },
});
const cloudinaryUpload = (0, multer_1.default)({ storage: cloudinaryStorage });
exports.default = cloudinaryUpload;
