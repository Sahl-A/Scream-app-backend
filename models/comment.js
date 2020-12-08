const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userHandle: { type: String },
    body: { type: String },
    screamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scream' },
    userImage: {type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);