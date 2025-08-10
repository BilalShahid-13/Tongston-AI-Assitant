import multer from "multer";

const storage = multer.memoryStorage(); // ✅ store file in memory as Buffer
export const upload = multer({ storage });

import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { config } from "dotenv";
config();
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const category = req.body.feedbackCategory || req.body.folder || "general";
    return {
      folder: `${category}`,
      // folder: `${process.env.FEEDBACK_FOLDER_NAME}/${category}`,
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
      resource_type: "auto",
    };
  },
});

const cloudinaryUpload = multer({ storage: cloudinaryStorage });

export default cloudinaryUpload;
