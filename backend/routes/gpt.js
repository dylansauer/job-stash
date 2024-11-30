const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { genAIResume } = require("../Controllers/gptController");

const router = express.Router();

// POST a new job
router.post("/genAIResume", genAIResume);

module.exports = router;
