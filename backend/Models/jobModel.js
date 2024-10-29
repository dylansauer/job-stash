const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema(
    {
        job_name: {
            type: String,
            required: true,
        },
        company_name: {
            type: String,
            required: true,
        },
        job_description: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
