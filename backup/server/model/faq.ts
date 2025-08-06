import { model, models, Schema } from "mongoose";


const faqSchema = new Schema({
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
  timestamps: true
})

export const Faq = models.Faq || model("Faq", faqSchema);