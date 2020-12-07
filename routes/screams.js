const express = require("express");

const screamsController = require("../controllers/screams");
const isAuth = require('../middlewares/is-auth')

const router = express.Router();

// GET /api/screams
router.get("/screams", screamsController.getAllScreams);
// POST /api/scream
router.post("/scream",isAuth, screamsController.postOneScream);
// Get One scream
router.get('/scream/:screamId', screamsController.getOneScream);
// Comment on Scream
router.post('/scream/:screamId/comment',isAuth, screamsController.commentOnScream);
// Like & Unlike Scream
router.get('/scream/:screamId/like-unlike', isAuth, screamsController.likeUnlikeScream);
// Delete Scream
router.delete('/scream/:screamId', isAuth, screamsController.deleteScream);


module.exports = router;
