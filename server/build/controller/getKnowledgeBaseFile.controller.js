"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKnowledgeBaseFile = getKnowledgeBaseFile;
exports.getKnowledgeBaseFileLength = getKnowledgeBaseFileLength;
const connectDb_1 = require("../lib/connectDb");
const knowledgeBaseFiles_1 = require("../model/knowledgeBaseFiles");
async function getKnowledgeBaseFile(req, res) {
    try {
        await (0, connectDb_1.connectMongo)();
        const file = await knowledgeBaseFiles_1.knowledgeBaseFile.find({});
        res.status(200).json({ message: "Success", data: file || [] });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getKnowledgeBaseFileLength(req, res) {
    try {
        // your logic here
        await (0, connectDb_1.connectMongo)();
        const file = await knowledgeBaseFiles_1.knowledgeBaseFile.countDocuments();
        res.status(200).json({ message: "Success", data: file || [] });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
