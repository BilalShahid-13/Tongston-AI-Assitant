"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
const redis_1 = __importDefault(require("../config/redis"));
async function verifyOtp(req, res) {
    try {
        // await connectMongo(); // ⬅️ make sure connection is established first
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ error: "Email and OTP are required" });
            return;
        }
        const record = await redis_1.default.get(`otp:${email}`);
        // const record = await OtpModel.findOne({ email });
        if (!record) {
            res.status(400).json({ error: "OTP not found or expired" });
            return;
        }
        if (record !== otp) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }
        // OTP is valid, remove it
        await redis_1.default.del(`otp:${email}`);
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: error });
    }
}
