import { config } from "dotenv";
import Redis from "ioredis";
config();

const redis = new Redis(process.env.REDIS_URL || "rediss://default:password@host:port");

redis.on("connect", () => {
  console.log("✅ Connected to Redis Cloud");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
