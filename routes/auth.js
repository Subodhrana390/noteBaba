import express from "express";
import controller from "../controllers/authController.js";
import cloudinaryFileUploader from "../middlewares/fileUploader.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

// Routes
router.post(
  "/register",
  cloudinaryFileUploader.single("profileImage"),
  controller.createUser
);
router.post("/login", controller.loginUser);
router.get("/", verifyToken, controller.getAllUsers);
router.get("/:id", verifyToken, controller.getUserById);
router.put(
  "/",
  verifyToken,
  cloudinaryFileUploader.single("profileImage"),
  controller.updateUserById
);

export default router;
