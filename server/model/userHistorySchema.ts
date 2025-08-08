// models/History.ts
import mongoose, { Schema, model, models } from "mongoose";
import { User } from "./user";

export interface IHistory {
  userId?: mongoose.Types.ObjectId | string;
  fields?: string[];
  answer?: string;
  plan: string;
  createdAt?: Date;
  updatedAt?: Date;
  metaData?: Object
}

const userHistorySchema = new Schema<IHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: false,
    },
    fields: {
      type: [String],
      required: false,
    },
    answer: {
      type: String,
      required: false,
    },
    plan: {
      type: String,
      required: true,
    },
    metaData: {
      type: Object,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "userHistories", // force exact collection name
  }
);

// Use a clear exported name. This will reuse the model if it already exists.
export const History = (models.History as mongoose.Model<IHistory>) ||
  model<IHistory>("History", userHistorySchema);
