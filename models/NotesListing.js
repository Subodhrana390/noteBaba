const mongoose = require("mongoose");

const NotesListingSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8, // Assuming there are only 8 semesters
    },
    listingDocUrl: [
      {
        _id: String,
        asset_id: String,
        url: String,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    topics: {
      type: String,
    },
    noteType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NotesListing = mongoose.model("NotesListing", NotesListingSchema);
module.exports = NotesListing;
