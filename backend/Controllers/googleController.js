const jwt = require("jsonwebtoken");

const oAuth2Client = require("../config/googleOAuth");
const User = require("../Models/userModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const authenticate = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    const { id_token: googleId } = tokens;
    console.log("Google ID Token:", googleId);

    // attempt to register, if the email is not already in use, it should make a user.
    const user = await User.googleLogin(googleId);

    const email = user.email;

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.error("Google Authentication error:", error);
    res.status(400).json({ error: "Google Authentication failed" });
  }
};

module.exports = { authenticate };
