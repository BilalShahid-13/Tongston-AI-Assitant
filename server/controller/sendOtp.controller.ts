// otpService.ts
import { Request, Response } from "express";
import { sendMail } from "../config/nodemailer";
import OtpModel from "../model/otp";
import { connectMongo } from "../lib/connectDb";

function generateHtmlEmail(otp: string): string {
  return `
  <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff8e6; border-radius: 12px; border: 1px solid #ffe5b4;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #fe9a00; margin-bottom: 8px; font-size: 28px;">T-World Entre.Edu</h1>
      <p style="color: #6b7280; font-size: 16px;">Empowering K-12 Students with AI-Driven Learning</p>
    </div>

    <!-- OTP Box -->
    <div style="background: linear-gradient(135deg, #ffb900, #fe9a00); padding: 30px; border-radius: 16px; text-align: center; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="color: #333; font-size: 34px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h2>
    </div>

    <!-- Info Section -->
    <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ffe58f;">
      <p style="margin: 0; color: #5c4411; font-size: 14px; line-height: 1.6;">
        <strong>🔒 Security Notice:</strong> This code will expire in <strong>10 minutes</strong>.
        Please use it to securely access your T-World K-12 AI Education account.
        Never share this code with anyone — even our support team.
      </p>
    </div>

    <!-- Platform Content -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 13px; margin-bottom: 10px;">
        T-World Entre.Edu helps students <strong>learn, create, and grow</strong> with the power of AI.
        Unlock access to your personalized K-12 entrepreneurial journey now!
      </p>
      <a href="${process.env.ORIGIN_URL}/admin" target="_blank"
         style="display: inline-block; background: #fe9a00; color: #fff; text-decoration: none; font-size: 14px; padding: 10px 20px; border-radius: 8px; font-weight: bold; margin-top: 10px;">
        Go to Platform →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px;">
      <p style="color: #9ca3af; font-size: 12px;">
        If you didn’t request this code, you can safely ignore this email.<br>
        © ${new Date().getFullYear()} T-World Entre.Edu | All Rights Reserved
      </p>
    </div>
  </div>`;
}

export async function sendOtp(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set expiration time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    connectMongo();
    // Remove any existing OTPs for this email (optional, to avoid multiple valid codes)
    await OtpModel.deleteMany({ email });

    // Save OTP in DB
    await OtpModel.create({
      email,
      otp,
      createdAt: new Date(),
      expiresAt,
      verified: false,
    });

    await sendMail("Your OTP Code", generateHtmlEmail(otp), email);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ error: error });
  }
}
