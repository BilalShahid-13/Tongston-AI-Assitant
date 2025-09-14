import { config } from "dotenv";
import nodemailer from "nodemailer";
config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  // port: 587,
  auth: {
    user: process.env.GOOGLE_APP_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
});
export async function sendMail(subject: string, html: string, to: string) {
  try {
    const info = await transporter.sendMail({
      to,
      from: process.env.GOOGLE_APP_USER,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("error from emailService", error);
    throw error; // better to throw instead of returning undefined info
  }
}
