const Comment = require("../../models/comment");
const Notification = require("../../models/notification");

module.exports = (req, res, next) => {
  Comment.watch().on("change", (change) => {
    const newNotification = new Notification({
      recepient: change.fullDocument.userHandle,
      sender: req.user.handle,
      read: false,
      screamId: change.documentKey._id,
      type: "comment",
    });
    console.log(change, "inside commmmmmmmmmmmmmmmmmmmmmmmmmmmentChange");
    async function test() {
      await newNotification.save();
    }
    test();
  });
  next();
};
