"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
exports.closeMongo = closeMongo;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
let client;
let db;
async function connectMongo() {
    if (db) {
        console.log("✅ MongoDB already connected");
        return db.collection("knowledgebase"); // Return the 'knowledgebase' collection
    }
    client = new mongodb_1.MongoClient(URI);
    await client.connect();
    db = client.db(DB_NAME);
    const collection = db.collection("knowledgebase"); // Get the 'knowledgebase' collection
    console.log("✅ MongoDB connected");
    return collection; // Return the collection
}
async function closeMongo() {
    if (client) {
        await client.close();
        console.log("🛑 MongoDB connection closed");
    }
}
