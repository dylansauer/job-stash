const express = require("express");

// controlleer functions

const { authenticate } = require("../Controllers/googleController");
const router = express.Router();

// route for /auth/google
router.post("/", authenticate);

module.exports = router;
