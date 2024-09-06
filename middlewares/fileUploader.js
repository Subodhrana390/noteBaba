import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => {
      const supportedFormats = [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "webp",
        "ppt",
        "pdf",
      ];
      const extension = file.mimetype.split("/")[1];
      return supportedFormats.includes(extension) ? extension : "jpg";
    },
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const cloudinaryFileUploader = multer({ storage });

export default cloudinaryFileUploader;
