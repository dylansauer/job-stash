const express = require("express");

// controlleer functions
const { registerUser, loginUser } = require("../Controllers/userController");
const router = express.Router();

// route for /auth/google
router.post("/", loginUser);
