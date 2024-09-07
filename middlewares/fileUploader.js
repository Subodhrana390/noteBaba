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
  params: async (req, file) => {
    let resourceType = "auto";
    let extension = "";

    switch (file.mimetype) {
      case "application/pdf":
        resourceType = "raw";
        extension = ".pdf";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        resourceType = "raw";
        extension = ".docx";
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        resourceType = "raw";
        extension = ".pptx";
        break;
      default:
        resourceType = "image";
        extension = "";
    }

    return {
      folder: "uploads",
      resource_type: resourceType,
      public_id: file.originalname.split(".")[0] + extension,
    };
  },
});

const cloudinaryFileUploader = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFormats = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
});

export default cloudinaryFileUploader;