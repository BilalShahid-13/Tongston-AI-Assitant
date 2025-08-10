import { model, models, Schema } from "mongoose";


// types.ts
export interface ChatDocument {
  messages: {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

// model
const faqHistorySchema = new Schema<ChatDocument>({
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export const faqHistory =
  models.faqHistory || model<ChatDocument>("faqHistory", faqHistorySchema);
