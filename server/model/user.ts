import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  username: string;
  subject: string;
  role: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    subject: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const User = (models.User as mongoose.Model<IUser>) || model<IUser>("User", userSchema);
