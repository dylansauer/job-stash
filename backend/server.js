require("dotenv").config();

const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");

const OpenAI = require("openai");
const { OAuth2Client } = require("google-auth-library");

const mongoose = require("mongoose");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const gptRoutes = require("./routes/gpt");

// express app
const app = express();

// init openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_ID,
  process.env.OAUTH_SECRET,
  "postmessage"
);

// avail
app.locals.openai = openai;

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    debug: true, // Add this while debugging
  })
);

// routes
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gpt", gptRoutes);

app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  // console.log(tokens);

  const { id_token: googleId } = tokens;
  console.log("test");
  console.log(googleId);

  res.json(tokens);
});

// conect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = {
  oAuth2Client,
};
