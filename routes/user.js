const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");

const userControllers = require("../controllers/user");
const User = require("../models/user");

const router = express.Router();

// When clicking on sign up button in signup page
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
          return Promise.reject("E-mail already in use");
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
      .withMessage("Handle should be 4 chars at least")
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
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (value) => {
        // To check if email is empty
        if (!value) {
          return Promise.reject("Please Enter an Email");
        }
        const user = await User.findOne({ email: value });
        if (!user) {
          throw new Error("Invalid E-mail");
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


module.exports = router;
