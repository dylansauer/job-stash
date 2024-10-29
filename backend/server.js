require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// conect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(
                "connected to db & listening on port",
                process.env.PORT
            );
        });
    })
    .catch((error) => {
        console.log(error);
    });
