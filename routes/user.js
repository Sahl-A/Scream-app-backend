const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");

const userControllers = require("../controllers/user");
const User = require("../models/user");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

// When clicking on sign up button in signup page
// /api/signup
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async (value) => {
        // Check if the email exists in DB
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already in use");
        }
        return true;
      })
      .normalizeEmail(),
    body("password", "Password should be more than 5 characters")
      .trim()
      // To check min 8 chars long, at least one uppercase, at least one lowercase & at least one special case
      // Activate it when in production
      // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
      .isLength({ min: 5 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Both passwords should match");
        }
        return true;
      }),
    body("handle")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Username should be 4 chars at least")
      .custom(async (value) => {
        // Check if the email exists in DB
        const user = await User.findOne({ handle: value });
        if (user) {
          return Promise.reject("Username in use. Pick different one...");
        }
        return true;
      }),
  ],
  userControllers.signup
);

// When clicking in login button
// /api/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (value) => {
        // To check if email is empty
        if (!value) {
          return Promise.reject("Please Enter an email");
        }
        const user = await User.findOne({ email: value });
        if (!user) {
          throw new Error("Invalid email");
        }
        return true;
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .custom(async (value, { req }) => {
        // To check if password is empty
        if (!value) {
          return Promise.reject("Please Enter a password");
        }
        try {
          // Get the user from DB to get the hashed Password
          const user = await User.findOne({ email: req.body.email });
          // Check user, as it might not be found cause body('password') is going to run anyway
          if(!user) return
          // Compare the passwords
          const isPasswordMatch = await bcrypt.compare(value, user.password);
          if (!isPasswordMatch) {
            return Promise.reject("password is wrong");
          }
          return true;
        } catch (err) {
          console.error(err);
          throw new Error(err);
        }
      }),
  ],
  userControllers.login
);

// Add user details (bio, website & location)
// /api/user
router.post('/user', isAuth, userControllers.addUserDetails)

// Get the own user details 
// /api/getAuthenticatedUser
router.get('/user', isAuth, userControllers.getAuthenticatedUser);

// Get any user details without being authunticated
//  /api/user/:handle
router.get('/user/:handle', userControllers.getUserDetails)

// When uploading profile pic
// /api/user/image
router.post("/user/image", isAuth, userControllers.uploadImage);
module.exports = router;
