import { model, models, Schema } from "mongoose";


const faqKnowledgeBaseSchema = new Schema({
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
}, {
  timestamps: true,
  collection: "faqKnowledgeBase"
})

export const faqKnowledgeBase = models.faqKnowledgeBase || model("faqKnowledgeBase", faqKnowledgeBaseSchema);
