// To hash the password
const bcrypt = require("bcrypt");
// Generate the token
const jwt = require("jsonwebtoken");
// get the validation errors
const { validationResult } = require("express-validator");

const User = require("../models/user");

const HOST_URL = `http://localhost:8080`;

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const handle = req.body.handle;

  // Check the validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  try {
    // Encrypt the password
    const hash = await bcrypt.hash(password, 12);

    // Add the user to DB
    const user = await new User({
      email,
      password: hash,
      handle,
      imageUrl: `${HOST_URL}/images/default-profile-picture1.jpg`
    }).save();

    res
      .status(201)
      .json({ message: `user ${user._id} has been created successfully` });
  } catch (err) {
    res.status(500).json({ error: err });
    console.error(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;

  // Check the validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  try {
    // Get the user to get its id
    const user = await User.findOne({ email });
    // Generate the token
    const token = jwt.sign(
      { email: user.email, _id: user._id, handle: user.handle },
      "SECRET KEY TO GENERATEE THE TOKEN<, SHOULD BE COMPLICATED",
      { expiresIn: "1h" }
    );
    // Send the token back
    res.status(200).json({
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ err: err.code });
  }
};

exports.uploadImage = async (req, res, next) => {
  if(!req.file) {
    return res.status(500).json({message: 'Cannot upload '})
  }
  const imageUrl = `${HOST_URL}/images/${req.file.filename}`;
  try {
    // get the current user and Add the image to it
    const user = await User.findOne({ email: req.user.email });
    user.imageUrl = [...user.imageUrl, imageUrl];
    await user.save();
    res.status(201).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ err: err.code });
    console.error(err);
  }
};
