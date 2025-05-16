import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "image") {
      return {
        folder: "exercise_images", // Cloudinary will auto-create this folder if it doesn't exist
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
        resource_type:"image"
      };
    } else if (file.fieldname === "video") {
      return {
        folder: "exercise_videos",
        resource_type: "video", // Important for video uploads
        allowed_formats: ["mp4", "mov", "avi"],
        transformation: [{ volume: "mute" }],  
      };
    }
  },
});

export const uploadFiles = multer({ storage });
