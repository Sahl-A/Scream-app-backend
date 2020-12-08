const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recepient: String,
    sender: String,
    read: Boolean,
    screamId: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
