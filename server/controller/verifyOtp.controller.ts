// controllers/verifyOtp.ts
import { Request, Response } from "express";
import redis from "../config/redis";

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  try {
    // await connectMongo(); // ⬅️ make sure connection is established first
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }

    const record = await redis.get(`otp:${email}`);
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
    await redis.del(`otp:${email}`);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: error });
  }
}
