import mongoose from "mongoose";
import Notes from "../models/Notes.js";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });
    return {
      _id: uploadResponse.original_filename,
      asset_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  } catch (err) {
    console.error("Error uploading image:", err.message);
    throw new Error("Failed to upload image.");
  }
};

const createNotes = async (req, res) => {
  try {
    const { subject, semester, title, description, noteType } = req.body;
    const files = req.files;
    const userID = req.userId;

    if (!subject || !semester || !title || !description || !noteType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    const listingDocUrl = await Promise.all(
      files.map(async (file) => {
        try {
          return await uploadImage(file);
        } catch (err) {
          console.error("Error processing file:", err.message);
          return null;
        }
      })
    ).then((results) => results.filter((result) => result !== null));

    if (listingDocUrl.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files could be uploaded.",
      });
    }

    const newNotes = new Notes({
      creator: userID,
      subject,
      semester,
      title,
      description,
      listingDocUrl,
      noteType,
    });

    await newNotes.save();

    res.status(201).json({
      success: true,
      message: "Note listing created successfully!",
      data: newNotes,
    });
  } catch (err) {
    console.error("Failed to create note listing:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create note listing.",
      error: err.message,
    });
  }
};

const getNotesByquery = async (req, res) => {
  const { subject, semester, noteType, page = 1, limit = 10 } = req.query;

  try {
    const query = {};
    if (subject) query.subject = subject;
    if (noteType) query.noteType = noteType;
    if (semester) {
      const semesterNumber = parseInt(semester, 10);
      if (
        Number.isInteger(semesterNumber) &&
        semesterNumber >= 1 &&
        semesterNumber <= 8
      ) {
        query.semester = semesterNumber;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid semester value. It should be between 1 and 8.",
        });
      }
    }

    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * pageSize;

    const [notes, totalCount] = await Promise.all([
      Notes.find(query).skip(skip).limit(pageSize).populate("creator").exec(),
      Notes.countDocuments(query).exec(),
    ]);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully.",
      data: {
        notes,
        total: totalCount,
        page: pageNumber,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (err) {
    console.error("Failed to fetch listings:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings.",
      error: err.message,
    });
  }
};

const getNotesBySearch = async (req, res) => {
  const { search } = req.params;

  try {
    if (typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid search query format.",
      });
    }

    let query = {};
    if (search.trim() !== "") {
      query = {
        $or: [
          { branch: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }, // Added description field
        ],
      };
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [notes, count] = await Promise.all([
      Notes.find(query).populate("creator").skip(skip).limit(limit),
      Notes.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Listings fetched successfully!",
      data: {
        notes,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings.",
      error: err.message,
    });
  }
};

const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format.",
      });
    }

    const note = await Notes.findById(noteId).populate("creator");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note retrieved successfully.",
      data: note,
    });
  } catch (err) {
    console.error("Error fetching note:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch note.",
      error: err.message,
    });
  }
};

export default { createNotes, getNotesByquery, getNotesBySearch, getNoteById };
