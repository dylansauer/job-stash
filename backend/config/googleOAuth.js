const { OAuth2Client } = require("google-auth-library");

const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_ID,
  process.env.OAUTH_SECRET,
  "postmessage"
);

module.exports = oAuth2Client;
