import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Rating } from '../model/rating';
import { connectMongo } from '../lib/connectDb';

export const getAllRatings = async (_req: Request, res: Response) => {
  try {
    connectMongo();
    const ratings = await Rating.find({});
    res.status(200).json(ratings);
  } catch (error: any) {
    console.error("Fetch Ratings Error:", error);
    res.status(500).json({ message: 'Failed to fetch ratings', error: error.message || error });
  }
};

export const createRating = async (req: Request, res: Response) => {
  try {
    const { userId, value } = req.body;
    connectMongo();
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Validate rating value
    if (typeof value !== 'number' || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    const rating = await Rating.create({ userId, value });
    res.status(201).json(rating);
  } catch (error: any) {
    console.error("Create Rating Error:", error);
    res.status(400).json({ message: 'Failed to create rating', error: error.message || error });
  }
};
