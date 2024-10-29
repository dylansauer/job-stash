const express = require("express");

// controlleer functions
const { registerUser, loginUser } = require("../Controllers/userController");
const router = express.Router();

// login route
router.post("/login", loginUser);

// register route
router.post("/register", registerUser);

module.exports = router;
