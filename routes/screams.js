const express = require("express");

const screamsController = require("../controllers/screams");

const router = express.Router();

// GET /api/screams
router.get("/screams", screamsController.getScreams);
// POST /api/scream
router.post("/scream", screamsController.createScreams);
module.exports = router;
