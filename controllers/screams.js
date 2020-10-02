// Get the DB post model
const Scream = require("../models/scream");

// When using GET /api/screams
exports.getAllScreams = async (req, res, next) => {
  try {
    // Get the screams from  DB 
    // Sort it newer to older
    const screams = await Scream.find().sort({createdAt: 'desc'});
    // Send the screams to the front-end
    res.status(200).json({ screams });
  } catch (err) {
    // ERR when getting the screams from DB
    res.status(500).json({error: 'Something went wrong'})
    // next(err);
  }
};

// When using POST api/scream
exports.postOneScream = async (req, res, next) => {
  // Get the data
  const data = {
    body: req.body.body,
    userHandle: req.user.handle,
  };
  const newScream = new Scream(data);
  try {
    await newScream.save();
    res.status(200).json({ message: `Scream ${newScream._id} added successfully`, data });
  } catch (err) {
    // Error on saving the new scream to the DB
    console.error(err);
    res.status(500).json({error: 'Something went wrong'})
  }
};
