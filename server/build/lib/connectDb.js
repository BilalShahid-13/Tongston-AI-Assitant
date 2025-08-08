"use strict";
// import { Db, MongoClient, Collection } from "mongodb";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// dotenv.config();
// const URI = process.env.MONGODB_URI as string;
// const DB_NAME = process.env.DB_NAME as string;
// let client: MongoClient;
// let db: Db;
// export async function connectMongo(): Promise<Collection> {
//   if (db) {
//     console.log("✅ MongoDB already connected");
//     return db.collection("knowledgebase"); // Return the 'knowledgebase' collection
//   }
//   client = new MongoClient(URI);
//   await client.connect();
//   db = client.db(DB_NAME);
//   const collection = db.collection("knowledgebase"); // Get the 'knowledgebase' collection
//   console.log("✅ MongoDB connected");
//   return collection;
// }
// lib/connectDb.ts
// import { Db, MongoClient } from "mongodb";
// import dotenv from "dotenv";
// dotenv.config();
// const URI = process.env.MONGODB_URI as string;
// const DB_NAME = process.env.DB_NAME as string;
// let client: MongoClient;
// let db: Db;
// export async function connectMongo(): Promise<Db> {
//   if (db) {
//     console.log("✅ MongoDB already connected");
//     return db;
//   }
//   client = new MongoClient(URI);
//   await client.connect();
//   db = client.db(DB_NAME);
//   console.log("✅ MongoDB connected");
//   return db;
// }
// export async function closeMongo(): Promise<void> {
//   if (client) {
//     await client.close();
//     console.log("🛑 MongoDB connection closed");
//   }
// }
const connectMongo = async () => {
    console.log("📡 connectMongo() called...");
    console.log("🔍 Current readyState:", mongoose_1.default.connection.readyState);
    if (mongoose_1.default.connection.readyState >= 1) {
        console.log("⚠️ Already connected to MongoDB");
        return;
    }
    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not defined");
        throw new Error("MONGODB_URI is not defined");
    }
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
};
exports.connectMongo = connectMongo;
