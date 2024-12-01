const oAuth2Client = require("../config/googleOAuth");

const authenticate = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    const { id_token: googleId } = tokens;
    console.log("Google ID Token:", googleId);

    res.json(tokens);
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(400).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticate };
