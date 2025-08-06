import { Schema, model, models } from "mongoose";

const feedbackSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrls: {
      type: [String], // Store uploaded file URLs or paths
      default: [],
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    otherCategoryDetail: {
      type: String,
      trim: true,
    },
    image: { type: Buffer },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

// Prevent model overwrite in dev
export const Feedback = models.Feedback || model("Feedback", feedbackSchema);
