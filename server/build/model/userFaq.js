"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userFaqSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional: can be anonymous
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: false, // In case answer is generated later
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});
const UserFaq = mongoose_1.default.model('UserFaq', userFaqSchema);
exports.default = UserFaq;
