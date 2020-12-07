// Get the DB post model
const Scream = require("../models/scream");
const Comment = require("../models/comment");
const User = require("../models/user");

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
  // Get the data
  const data = {
    body: req.body.body,
    userHandle: req.user.handle,
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
  const data = {
    screamId: req.params.screamId,
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };
  // No empty body
  if (data.body.trim() === "")
    return res.status(400).json({ error: "Must not be empty" });

  try {
    // Check if the scream is found
    if (!(await Scream.findById(req.params.screamId)))
      return res.status(404).json({ error: "Scream does not exist anymore" });
    // Save the comment & send the response
    const newComment = new Comment(data);
    await newComment.save();
    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};
