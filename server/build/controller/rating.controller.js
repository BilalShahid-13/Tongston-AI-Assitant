"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRating = exports.getAllRatings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rating_1 = require("../model/rating");
const connectDb_1 = require("../lib/connectDb");
const getAllRatings = async (_req, res) => {
    try {
        (0, connectDb_1.connectMongo)();
        const ratings = await rating_1.Rating.find({});
        res.status(200).json(ratings);
    }
    catch (error) {
        console.error("Fetch Ratings Error:", error);
        res.status(500).json({ message: 'Failed to fetch ratings', error: error.message || error });
    }
};
exports.getAllRatings = getAllRatings;
const createRating = async (req, res) => {
    try {
        const { userId, value } = req.body;
        (0, connectDb_1.connectMongo)();
        // Validate userId format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }
        // Validate rating value
        if (typeof value !== 'number' || value < 1 || value > 5) {
            return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
        }
        const rating = await rating_1.Rating.create({ userId, value });
        res.status(201).json(rating);
    }
    catch (error) {
        console.error("Create Rating Error:", error);
        res.status(400).json({ message: 'Failed to create rating', error: error.message || error });
    }
};
exports.createRating = createRating;
