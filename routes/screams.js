const express = require("express");

const screamsController = require("../controllers/screams");
const isAuth = require('../middlewares/is-auth')

const router = express.Router();

// GET /api/screams
router.get("/screams", screamsController.getAllScreams);
// POST /api/scream
router.post("/scream",isAuth, screamsController.postOneScream);
module.exports = router;
