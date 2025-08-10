// models/knowledgeBaseFile.ts
import { model, models, Schema } from "mongoose";

const knowledgeBaseFileSchema = new Schema(
  {
    fileId: { type: String, required: true }, // Cloudinary public_id
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { timestamps: true }
);

export const knowledgeBaseFile =
  models.knowledgeBaseFile || model("knowledgeBaseFile", knowledgeBaseFileSchema);
