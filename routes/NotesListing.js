const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const NotesListing = require("../models/NotesListing");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const uploadImage = async (file) => {
  const uploadResponse = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    pages: true,
  });
  return { _id: uploadResponse.secure_url, url: uploadResponse.url };
};

router.post("/create", upload.array("noteFiles"), async (req, res) => {
  try {
    const { creator, subject, semester, title, description, noteType } =
      req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    // Prepare the listingDocUrl array with object structure {_id, url}
    const listingDocUrl = await Promise.all(
      files.map(async (file) => {
        const resUrl = await uploadImage(file.path);
        console.log(resUrl);
        return { _id: file.filename, asset_id: resUrl._id, url: resUrl.url }; // _id can be file's original name or some unique identifier
      })
    );

    // Create a new NotesListing document
    const newListing = new NotesListing({
      creator,
      subject,
      semester,
      title,
      description,
      listingDocUrl,
      noteType,
    });

    await newListing.save();

    res.status(200).json(newListing);
  } catch (err) {
    res
      .status(409)
      .json({ message: "Failed to create listing", error: err.message });
    console.error(err);
  }
});

/* GET lISTINGS BY Query */
router.get("/", async (req, res) => {
  const { subject, semester, noteType } = req.query;
  try {
    let query = {};

    if (subject) query.subject = subject;
    if (noteType) query.noteType = noteType;

    if (semester) query.semester = parseInt(semester);

    let listings = await NotesListing.find(query).populate("creator");

    res.status(200).json({ data: listings });
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

const updateFile = async (id, publicId, filePath) => {
  try {
    // Update file logic here
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
    });

    await NotesListing.updateOne(
      { _id: id },
      {
        $set: {
          "listingDocUrl.$[element]": {
            _id: publicId,
            url: uploadResult.secure_url,
          },
        },
      },
      {
        arrayFilters: [{ "element._id": publicId }],
      }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

router.put("/:id", upload.single("notes"), async (req, res) => {
  try {
    const { id } = req.params;
    const { public_id } = req.body;
    if (!id) {
      res.status(401).json({ message: "Invalid request" });
    }

    if (public_id && req.file) {
      await updateFile(id, public_id, req.file.path);
    }

    const listing = await NotesListing.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.status(202).json({ listing, message: "Update successfully" });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Fail to update Listing", error: error.message });
    console.log(error);
  }
});

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;

  try {
    let listings = [];

    if (search === "all") {
      listings = await NotesListing.find().populate("creator");
    } else {
      listings = await NotesListing.find({
        $or: [
          { branch: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }

    res.status(200).json(listings);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await NotesListing.findById(listingId).populate("creator");
    res.status(202).json(listing);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Listing can not found!", error: err.message });
  }
});
router.delete("/assets/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;
    cloudinary.api
      .resource(public_id)
      .then(async () => {
        await cloudinary.uploader.destroy(public_id);
        res.status(202).json({
          message: `The asset of ${public_id} is removed`,
        });
      })
      .catch((err) => {
        res.status(404).json({
          message: `Asset ${public_id} is already deleted or does not exist`,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Some Error occured",
      error: error.message,
    });
  }
});

module.exports = router;
