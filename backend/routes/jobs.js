const express = require("express");
const {
    getJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob,
} = require("../Controllers/jobController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all job routes
router.use(requireAuth);

// Get all jobs
router.get("/", getJobs);

// GET a single job
router.get("/:jid", getJob);

// POST a new job
router.post("/", createJob);

//DELETE a job
router.delete("/:jid", deleteJob);

// UPDATE a job
router.patch("/:jid", updateJob);

module.exports = router;
