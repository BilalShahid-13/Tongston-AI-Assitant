"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
const otp_1 = __importDefault(require("../model/otp"));
const connectDb_1 = require("../lib/connectDb");
async function verifyOtp(req, res) {
    try {
        await (0, connectDb_1.connectMongo)(); // ⬅️ make sure connection is established first
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ error: "Email and OTP are required" });
            return;
        }
        const record = await otp_1.default.findOne({ email });
        if (!record) {
            res.status(400).json({ error: "OTP not found or expired" });
            return;
        }
        if (record.otp !== otp) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }
        // OTP is valid, remove it
        await otp_1.default.deleteOne({ email });
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
