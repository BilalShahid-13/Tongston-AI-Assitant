// models/knowledgeBase.ts
import { model, models, Schema } from "mongoose";

const knowledgeBaseSchema = new Schema(
  {
    fileId: {
      type: String,
      required: true
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    vector: {
      type: [Number], // array of floats (embedding vector)
      required: true,
    },
  },
  { timestamps: true }
);

export const knowledgeBase =
  models.knowledgeBase || model("knowledgeBase", knowledgeBaseSchema);
