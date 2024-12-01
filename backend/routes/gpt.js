const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { genAIResume, genAILetter } = require("../Controllers/gptController");

const router = express.Router();

// require auth for all job routes
router.use(requireAuth);

// routes for generating the resume, cover letter
router.post("/genAIResume", genAIResume);
router.post("/genAILetter", genAILetter);

module.exports = router;
