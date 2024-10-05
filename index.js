import express from "express";
import dotenv from "dotenv";
import axios from axios;
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
app.get("/health", (req, res) => {
  res.send("Health! Ok");
});

const keepAlive = () => {
  setInterval(async () => {
    try {
      const res = await axios.get('https://dmc-server.onrender.com/health');
      console.log(`Self-ping success: ${res.data}`);
    } catch (error) {
      console.error('Self-ping failed:', error.message);
    }
  }, 13 * 60 * 1000);
};


// Server Initialization
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  keepAlive()
});
