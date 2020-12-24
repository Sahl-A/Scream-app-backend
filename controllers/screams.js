// Get the DB post model
const Scream = require("../models/scream");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

// When using GET /api/screams
exports.getAllScreams = async (req, res, next) => {
  try {
    // Get the screams from  DB
    // Sort it newer to older
    const screams = await Scream.find().sort({ createdAt: "desc" });
    // Send the screams to the front-end
    res.status(200).json({ screams });
  } catch (err) {
    // ERR when getting the screams from DB
    res.status(500).json({ error: "Something went wrong" });
    // next(err);
  }
};

// When using POST api/scream
exports.postOneScream = async (req, res, next) => {
  // If user changed profile pic and posts a new post without logging out, it will use the old profile pic,
  // So, we will fetch the userImage from DB directly not from the token as used with the rest
  const user = await User.findOne({ handle: req.user.handle });
  // Get the data
  const data = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: user.currImageUrl,
    likeCount: 0,
    commentCount: 0,
  };
  const newScream = new Scream(data);
  try {
    await newScream.save();
    res
      .status(200)
      .json({ message: `Scream ${newScream._id} added successfully`, data });
  } catch (err) {
    // Error on saving the new scream to the DB
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get One scream Details
exports.getOneScream = async (req, res, next) => {
  const screamId = req.params.screamId;
  let detailedScream;
  try {
    const scream = await Scream.findById(screamId);
    const comments = await Comment.find({ screamId }).sort({
      createdAt: "desc",
    });
    detailedScream = { ...scream._doc, comments };
    res.json(detailedScream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

// Comment on scream
exports.commentOnScream = async (req, res) => {
  const screamId = req.params.screamId;
  // If user changed profile pic and posts a new post without logging out, it will use the old profile pic,
  // So, we will fetch the userImage from DB directly not from the token as used with the rest
  const user = await User.findOne({ handle: req.user.handle });
  const data = {
    screamId,
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: user.currImageUrl,
  };
  // No empty body
  if (data.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  try {
    // Check if the scream is found
    const currScream = await Scream.findById(screamId);
    if (!currScream)
      return res.status(404).json({ error: "Scream does not exist anymore" });

    // Save the comment
    const newComment = new Comment(data);
    await newComment.save();

    // Increment the comment count
    currScream.commentCount = currScream.commentCount + 1;
    await currScream.save();

    // Send the response
    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

// Like a scream
exports.likeUnlikeScream = async (req, res) => {
  const screamId = req.params.screamId;
  try {
    // Check if the scream exists
    const scream = await Scream.findById(screamId);
    if (!scream)
      return res.status(400).json({ error: "scream does not exist anymore" });

    // Check if the like found by the current user for the current scream
    const currLike = await Like.findOne({
      userHandle: req.user.handle,
      screamId,
    });
    if (currLike) {
      // Remove the like from the db
      await currLike.remove();
      // Decrement the likeCount in scream
      scream.likeCount = scream.likeCount - 1;
      await scream.save();

      // Return the response
      return res.json(scream);
    }

    // When it is not liked, add a new like to the document & save it
    const newLike = new Like({
      userHandle: req.user.handle,
      screamId,
    });
    await newLike.save();

    // Then update the likes count in the scream
    scream.likeCount = scream.likeCount + 1;
    await scream.save();

    // Send the response
    return res.json(scream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

// Delete a Scream
exports.deleteScream = async (req, res) => {
  const screamId = req.params.screamId;

  try {
    const currScream = await Scream.findById(screamId);
    // If scream does not exist, return
    if (!currScream)
      return res.status(400).json({ error: "Scream does not exist anymore" });

    // If Scream does not belong to the current user
    if (currScream.userHandle !== req.user.handle)
      return res.status(403).json({ error: "Unauthorized" });

    // Remove Scream if it belongs to the current user
    currScream.remove();
    return res.json({ message: "Scream deleted successfully", currScream });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};
