const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    handle: {
      type: String,
      required: true,
    },
    imageUrl: [{ type: String }],
    currImageUrl: { type: String },
    bio: { type: String },
    website: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
