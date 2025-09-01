"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rating_controller_1 = require("../controller/rating.controller");
const ratingRouter = express_1.default.Router();
// Admin route to view all ratings
ratingRouter.get('/getAllRatings', rating_controller_1.getAllRatings);
// Public route to submit a rating
ratingRouter.post('/createRating', rating_controller_1.createRating);
exports.default = ratingRouter;
