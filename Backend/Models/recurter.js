const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String },
    companyWebsite: { type: String },
    companyLocation: { type: String },
    about: { type: String },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;

