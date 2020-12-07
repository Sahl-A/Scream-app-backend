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
// Like Scream
// Unlike Scream
// Delete Scream


module.exports = router;
