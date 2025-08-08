"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    subject: { type: String, required: true },
    role: { type: String, required: true },
}, {
    timestamps: true, // adds createdAt and updatedAt automatically
});
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
