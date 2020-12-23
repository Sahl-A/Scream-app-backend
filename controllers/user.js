// To hash the password
const bcrypt = require("bcrypt");
// Generate the token
const jwt = require("jsonwebtoken");
// get the validation errors
const { validationResult } = require("express-validator");

const User = require("../models/user");
const Scream = require("../models/scream");
const Like = require("../models/like");

const environment = process.env.NODE_ENV || "development";

const port = process.env.PORT || 8080;
let HOST_URL;

if (environment === "development") {
  HOST_URL = `http://localhost:8080`;
} else {
  HOST_URL = `https://discoverit-backend.herokuapp.com:${port}`;
}

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
      imageUrl: `${HOST_URL}/images/default-profile-picture1.jpg`,
    }).save();

    // Generate the token
    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        handle: user.handle,
        imageUrl: user.imageUrl[user.imageUrl.length - 1],
      },
      "SECRET KEY TO GENERATEE THE TOKEN<, SHOULD BE COMPLICATED",
      { expiresIn: "500h" }
    );

    res.status(201).json({
      token,
      userId: user._id,
    });
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
    // Get the user from DB
    const user = await User.findOne({ email });
    // Generate the token
    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        handle: user.handle,
        imageUrl: user.imageUrl[user.imageUrl.length - 1],
      },
      "SECRET KEY TO GENERATEE THE TOKEN<, SHOULD BE COMPLICATED",
      { expiresIn: "500h" }
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

// Add user details
exports.addUserDetails = async (req, res, next) => {
  try {
    // Get the current user
    const user = await User.findById(req.user._id);
    // Add/update the details
    user.bio = req.body.bio;
    user.website = req.body.website;
    user.location = req.body.location;
    await user.save();
    res.json({ message: "Details added successfully" });
  } catch (err) {
    res.status(500).json({ err: err.code });
    console.error(err);
  }
};

// Get  the user own details when he is authenticated
exports.getAuthenticatedUser = async (req, res, next) => {
  // userData Example
  /*   const userData = {
    credentials: {
      userId: 'gsdg089dr4tsdgsdg',
      email: 'test@test.com',
      handle: 'test 1',
      createdAt: '2020-12-06T11:41:16.052+00:00',
      imageUrl: 'images/personal-photo.jpg',
      bio: 'this is my bio',
      website: 'test.com',
      location: 'EG, Cairo'
    },
    likes: {
      userHandle: 'test 1',
      screamId: 'safd8934509sdf'
    }
  }; */
  const userData = {};
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Get the likes belong to the user
      const likes = await Like.find({ userHandle: req.user.handle });
      // Prepare the data to be sent
      userData.credentials = { ...user._doc };
      userData.likes = likes.length ? likes : [];
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json({ err: err.code });
    console.error(err);
  }
};

// Get general user details without authentication
exports.getUserDetails = async (req, res) => {
  const userName = req.params.handle;
  let data;
  try {
    const currUser = await User.findOne({ handle: userName });
    // Exit if user does not exist
    if (!currUser)
      return res.status(404).json({ error: "User Does not exist" });

    // Get all screams posted by this user
    const screams = await Scream.find({ userHandle: userName }).sort({
      createdAt: "desc",
    });

    // Return the needed data from user
    data = {
      user: {
        imageUrl: currUser.imageUrl[currUser.imageUrl.length - 1],
        createdAt: currUser.createdAt,
        handle: currUser.handle,
        email: currUser.email,
        bio: currUser.bio,
        location: currUser.location,
        website: currUser.website,
        _id: currUser._id,
      },
      screams,
    };

    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

exports.uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(500).json({ message: "Cannot upload " });
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
