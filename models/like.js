const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userHandle: String,
    // screamId: { type: mongoose.Schema.Types.ObjectId, ref: "Scream" },
    screamId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
