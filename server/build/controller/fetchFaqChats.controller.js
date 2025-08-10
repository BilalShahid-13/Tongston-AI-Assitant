"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFaqChats = fetchFaqChats;
const connectDb_1 = require("../lib/connectDb");
const faqHistory_1 = require("../model/faqHistory");
async function fetchFaqChats(req, res) {
    try {
        await (0, connectDb_1.connectMongo)();
        let chatHistory = await faqHistory_1.faqHistory.find({});
        res.status(200).json({ message: "Success", data: chatHistory || [] });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
