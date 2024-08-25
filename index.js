const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dyceamtvk",
  api_key: "436569631896442",
  api_secret: "fONElqz3VaxzyDEES2VxKt_7tiM",
});

const authRoutes = require("./routes/auth.js");
const notesListingRoutes = require("./routes/NotesListing.js");

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/notes", notesListingRoutes);

const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Dream_Nest",
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
