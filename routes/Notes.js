import express from "express";
import controller from "../controllers/notesController.js";
import cloudinaryFileUploader from "../middlewares/fileUploader.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post(
  "/create",
  verifyToken,
  cloudinaryFileUploader.fields([
    { name: "noteFiles", maxCount: 12 },
    { name: "docImg", maxCount: 1 },
  ]),
  controller.createNotes
);

router.get("/", controller.getNotesByquery);
router.get("/:noteId", controller.getNoteById);
router.get("/", controller.getNoteBySlug);
router.get("/search/:search", controller.getNotesBySearch);

export default router;
