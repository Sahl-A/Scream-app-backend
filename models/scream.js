const mongoose = require("mongoose");

const screamSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    userHandle: {
      type: String,
      required: true,
    },
    userImage: { type: String },
    likeCount: { type: Number },
    commentCount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scream", screamSchema);
