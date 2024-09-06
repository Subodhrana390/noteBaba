import express from "express";
import controller from "../controllers/notesController.js";
import cloudinaryFileUploader from "../middlewares/fileUploader.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post(
  "/create",
  verifyToken,
  cloudinaryFileUploader.array("noteFiles", 12),
  controller.createNotes
);

router.get("/", controller.getNotesByquery);
router.get("/:noteId", controller.getNoteById);
router.get("/search/:search", controller.getNotesBySearch);

export default router;
