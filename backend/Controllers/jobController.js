const Job = require("../Models/jobModel");
const mongoose = require("mongoose");

// get all jobs
const getJobs = async (req, res) => {
    const user_id = req.user._id;

    const jobs = await Job.find({ user_id }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
};

// get a single job
const getJob = async (req, res) => {
    const { jid } = req.params;

    const job = await Job.findById(jid);

    if (!mongoose.Types.ObjectId.isValid(jid)) {
        return res.status(404).json({ error: "No such Job" });
    }

    if (!job) {
        return res.status(404).json({ error: "No such Job" });
    }
    res.status(200).json(job);
};
// create a job
const createJob = async (req, res) => {
    const { job_name, company_name, job_description } = req.body;

    let emptyFields = [];

    if (!job_name) {
        emptyFields.push("job_name");
    }
    if (!company_name) {
        emptyFields.push("company_name");
    }
    if (!job_description) {
        emptyFields.push("job_description");
    }
    if (emptyFields.length > 0) {
        return res
            .status(400)
            .json({ error: "Please fill in all the fields", emptyFields });
    }

    // add doc to db
    try {
        const user_id = req.user._id;
        const job = await Job.create({
            job_name,
            company_name,
            job_description,
            user_id,
        });
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a job
const deleteJob = async (req, res) => {
    const { jid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jid)) {
        return res.status(404).json({ error: "No such Job" });
    }

    const job = await Job.findOneAndDelete({ _id: jid });

    if (!job) {
        return res.status(400).json({ error: "No such Job" });
    }

    res.status(200).json(job);
};
// update a job
const updateJob = async (req, res) => {
    const { jid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jid)) {
        return res.status(404).json({ error: "No such Job" });
    }

    const job = await Job.findOneAndUpdate(
        { _id: jid },
        {
            ...req.body,
        }
    );

    if (!job) {
        return res.status(404).json({ error: "No such Job" });
    }

    res.status(200).json(job);
};

module.exports = {
    getJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob,
};
