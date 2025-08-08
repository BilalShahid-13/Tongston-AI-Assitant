"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const getLatestPlan_controller_1 = require("../controller/getLatestPlan.controller");
const planFiles_controller_1 = require("../controller/planFiles.controller");
const connectDb_1 = require("../lib/connectDb");
const userRouter = (0, express_1.Router)();
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(uri);
const db = client.db();
const collection = db.collection("users");
(0, dotenv_1.config)();
userRouter.get("/getUser", async (req, res) => {
    try {
        await (0, connectDb_1.connectMongo)();
        const result = await collection.find({}).toArray();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
userRouter.get("/getPlanFiles", planFiles_controller_1.getUserPlans);
userRouter.post("/getLatestProjectTaskPlan", getLatestPlan_controller_1.getLatestPlan);
exports.default = userRouter;
