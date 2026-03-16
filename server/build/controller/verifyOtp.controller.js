"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
const redis_1 = __importDefault(require("../config/redis"));
// export async function verifyOtp(req: Request, res: Response): Promise<void> {
//   try {
//     // await connectMongo(); // ⬅️ make sure connection is established first
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       res.status(400).json({ error: "Email and OTP are required" });
//       return;
//     }
//     const record = await redis.get(`otp:${email}`);
//     // const record = await OtpModel.findOne({ email });
//     if (!record) {
//       res.status(400).json({ error: "OTP not found or expired" });
//       return;
//     }
//     if (record !== otp) {
//       res.status(400).json({ error: "Invalid OTP" });
//       return;
//     }
//     // OTP is valid, remove it
//     await redis.del(`otp:${email}`);
//     res.status(200).json({ message: "Success" });
//   } catch (error) {
//     console.error("Verify OTP error:", error);
//     res.status(500).json({ error: error });
//   }
// }
async function verifyOtp(req, res) {
    try {
        const { emails, otp } = req.body;
        if (!emails || !Array.isArray(emails) || emails.length === 0 || !otp) {
            res.status(400).json({ error: "Emails array and OTP are required" });
            return;
        }
        let isVerified = false;
        for (const email of emails) {
            const record = await redis_1.default.get(`otp:${email}`);
            if (record && record === otp) {
                // ✅ Match found → remove it and mark verified
                await redis_1.default.del(`otp:${email}`);
                isVerified = true;
                break;
            }
        }
        if (!isVerified) {
            res.status(400).json({ error: "Invalid or expired OTP for all emails" });
            return;
        }
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Server error while verifying OTP" });
    }
}
