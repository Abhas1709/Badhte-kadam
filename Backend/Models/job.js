const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "accepted", "rejected", "hired"],
      default: "applied",
    },
    coverLetter: { type: String },
    resumeUrl: { type: String },
  },
  { _id: false, timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    location: { type: String },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    salaryFrom: { type: Number },
    salaryTo: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    applications: [jobApplicationSchema],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

