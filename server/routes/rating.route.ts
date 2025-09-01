import express from 'express';
import { createRating, getAllRatings } from '../controller/rating.controller';

const ratingRouter = express.Router();

// Admin route to view all ratings
ratingRouter.get('/getAllRatings', getAllRatings);

// Public route to submit a rating
ratingRouter.post('/createRating', createRating);

export default ratingRouter;
