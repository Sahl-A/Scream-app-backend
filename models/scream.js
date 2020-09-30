const mongoose = require("mongoose");

const screamSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  userHandle: {
    type: String,
    required: true
  },
  likeCount: {
    type: Number,
    // required: true
  },
  commentCount: {
    type: Number,
    // required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Scream', screamSchema);