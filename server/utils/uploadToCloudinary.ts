import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  filename: string,
  folder: string = "knowledgeBase"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `tongston/${folder}`, // ✅ No leading slashes
        public_id: `${Date.now()}-${nameWithoutExtension.replace(/\s+/g, "_")}`,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      }
    );

    stream.end(buffer);
  });
};