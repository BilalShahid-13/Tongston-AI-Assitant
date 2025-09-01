"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const ioredis_1 = __importDefault(require("ioredis"));
(0, dotenv_1.config)();
const redis = new ioredis_1.default(process.env.REDIS_URL || "rediss://default:password@host:port");
redis.on("connect", () => {
    console.log("✅ Connected to Redis Cloud");
});
redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
exports.default = redis;
