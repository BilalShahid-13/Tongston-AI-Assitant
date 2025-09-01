"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpFaq = helpFaq;
exports.getHelpFaqList = getHelpFaqList;
exports.updateHelpFaq = updateHelpFaq;
exports.deleteHelpFaq = deleteHelpFaq;
const redis_1 = __importDefault(require("../config/redis"));
const uuid_1 = require("uuid");
async function helpFaq(req, res) {
    try {
        const { heading, description, category } = req.body;
        if (!heading || !description) {
            res.status(400).json({ error: "Heading and description are required" });
            return;
        }
        const faq = {
            id: (0, uuid_1.v4)(), // simple unique ID
            // id: Date.now().toString(), // simple unique ID
            heading,
            description,
        };
        await redis_1.default.rpush(`helpFaqs:${category}`, JSON.stringify(faq));
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getHelpFaqList(req, res) {
    try {
        const { category } = req.body;
        const faqs = await redis_1.default.lrange(`helpFaqs:${category}`, 0, -1);
        const parsedFaqs = faqs.map(faq => {
            const parsed = JSON.parse(faq);
            return { ...parsed, category };
        });
        res.status(200).json(parsedFaqs);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function updateHelpFaq(req, res) {
    try {
        const { category, id, heading, description } = req.body;
        if (!category || !id || !heading || !description) {
            res.status(400).json({ error: "Category, id, heading, and description are required" });
            return;
        }
        const key = `helpFaqs:${category}`;
        const faqs = await redis_1.default.lrange(key, 0, -1);
        let updated = false;
        const updatedFaqs = faqs.map((faqStr) => {
            const faq = JSON.parse(faqStr);
            if (faq.id === id) {
                updated = true;
                return JSON.stringify({ ...faq, heading, description });
            }
            return faqStr;
        });
        if (!updated) {
            res.status(404).json({ error: "FAQ not found" });
            return;
        }
        // Overwrite the entire list
        await redis_1.default.del(key);
        await redis_1.default.rpush(key, ...updatedFaqs);
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function deleteHelpFaq(req, res) {
    try {
        const { category, id } = req.body;
        if (!category || !id) {
            res.status(400).json({ error: "Category and id are required" });
            return;
        }
        const key = `helpFaqs:${category}`;
        const faqs = await redis_1.default.lrange(key, 0, -1);
        const filteredFaqs = faqs.filter((faqStr) => {
            const faq = JSON.parse(faqStr);
            return faq.id !== id;
        });
        if (filteredFaqs.length === faqs.length) {
            res.status(404).json({ error: "FAQ not found" });
            return;
        }
        await redis_1.default.del(key);
        if (filteredFaqs.length > 0) {
            await redis_1.default.rpush(key, ...filteredFaqs);
        }
        res.status(200).json({ message: "FAQ deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
