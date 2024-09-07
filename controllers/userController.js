import User from "../models/User";
import Notes from "../models/Notes";

const Add_to_Wishlist = async (req, res) => {
  const { userId, noteId } = req.params;
  try {
    const user = await User.findById(userId);
    const note = await Notes.findById(noteId);

    const favouriteListing = user.wishList.find(
      (item) => item._id.toString() === noteId
    );

    if (favouriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== noteId
      );
      await user.save();
      res.status(200).json({
        messagge: "note is removed from wishList",
        wishList: user.wishList,
      });
    } else {
      user.wishList.push(note);
      await user.save();
    }
  } catch (error) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

export default { Add_to_Wishlist };
