// import { Db, MongoClient, Collection } from "mongodb";
// import dotenv from "dotenv";

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

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
