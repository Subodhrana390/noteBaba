import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
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
        _id: {
          type: String,
          required: true,
        },
        asset_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
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
    noteType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", NotesSchema);

export default Notes;
