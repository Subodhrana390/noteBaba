import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/Notes.js";
import "./database/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", notesRoutes);

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
