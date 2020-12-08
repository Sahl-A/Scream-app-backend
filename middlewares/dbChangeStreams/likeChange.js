const Like = require("../../models/like");
const Notification = require("../../models/notification");

module.exports = (req, res, next) => {
  Like.watch().on("change", (change) => {
    console.log(change, "inside likeeeeeeeeeeeeeeeeeeeeeeeeeeeeChange");
    // Remove the notification if the user removed the like on scream
    if (change.operationType === "delete") {
      (async function t() {
        const currNotification = await Notification.findOne({
          screamId: change.documentKey._id,
        });
        if (currNotification) await currNotification.remove();
      })();
    } else {
      // Don't send notification if you like yourself
      if (req.user.handle === change.fullDocument.userHandle) return;
      // Continue
      const newNotification = new Notification({
        recepient: change.fullDocument.userHandle,
        sender: req.user.handle,
        read: false,
        screamId: change.documentKey._id,
        type: "like",
      });
      async function test() {
        await newNotification.save();
      }
      test();
    }
  });
  next();
};
