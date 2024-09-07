import express from "express";
const router = express.Router();
import controller from "../controllers/userController.js";

router.post("/:userid/:noteId", controller.Add_to_Wishlist);

export default router;
