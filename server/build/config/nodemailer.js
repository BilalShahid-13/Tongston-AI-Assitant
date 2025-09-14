"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    // port: 587,
    auth: {
        user: process.env.GOOGLE_APP_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
    connectionTimeout: 10000, // 10 seconds
});
async function sendMail(subject, html, to) {
    try {
        const info = await transporter.sendMail({
            to,
            from: process.env.GOOGLE_APP_USER,
            subject,
            html,
        });
        return info;
    }
    catch (error) {
        console.error("error from emailService", error);
        throw error; // better to throw instead of returning undefined info
    }
}
