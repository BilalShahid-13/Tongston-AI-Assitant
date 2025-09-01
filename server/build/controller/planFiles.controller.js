"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPlans = getUserPlans;
const connectDb_1 = require("../lib/connectDb");
const user_1 = require("../model/user");
const userHistorySchema_1 = require("../model/userHistorySchema");
async function getUserPlans(req, res) {
    try {
        await (0, connectDb_1.connectMongo)();
        const plans = await userHistorySchema_1.History.find({}).sort({ createdAt: -1 }).populate({
            path: "userId",
            model: user_1.User,
        });
        if (plans.length > 0) {
            res.status(200).json({
                success: true,
                count: plans.length,
                data: plans,
            });
        }
        else {
            res.status(404).json({ success: false, message: "No plans found" });
        }
    }
    catch (error) {
        console.error("❌ Error in getUserPlans:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
