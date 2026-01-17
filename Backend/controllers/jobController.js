const Job = require("../Models/job");
const Student = require("../Models/student");
const Recruiter = require("../Models/recurter");
const User = require("../Models/user");
const {
  sendApplicationStatusEmail,
} = require("../services/emailService");

async function createJob(req, res) {
  try {
    const { title, description, skills, location, jobType, salaryFrom, salaryTo } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Title and description are required",
        });
    }
    const job = await Job.create({
      title,
      description,
      skills,
      location,
      jobType,
      salaryFrom,
      salaryTo,
      createdBy: req.user.id,
    });
    return res.status(201).json({
      success: true,
      message: "Job created",
      job,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function updateJob(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findOne({ _id: id, createdBy: req.user.id });
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    const allowed = ["title", "description", "skills", "location", "jobType", "salaryFrom", "salaryTo", "status"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });
    await job.save();
    return res.json({
      success: true,
      message: "Job updated",
      job,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function listJobs(req, res) {
  try {
    const { q, location, skills } = req.query;
    const filter = { status: "open" };
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (skills) {
      const arr = skills.split(",").map((s) => s.trim());
      filter.skills = { $all: arr };
    }
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    const recruiterUserIds = [...new Set(jobs.map((j) => j.createdBy.toString()))];
    const recruiterProfiles = await Recruiter.find({ user: { $in: recruiterUserIds } });
    const profileByUserId = new Map();
    recruiterProfiles.forEach((p) => {
      profileByUserId.set(p.user.toString(), p);
    });
    const withCompany = jobs.map((job) => {
      const obj = job.toObject();
      const rp = profileByUserId.get(job.createdBy.toString());
      obj.companyName = rp?.companyName || null;
      obj.companyLocation = rp?.companyLocation || null;
      obj.companyWebsite = rp?.companyWebsite || null;
      return obj;
    });
    return res.json({
      success: true,
      message: "Jobs fetched",
      jobs: withCompany,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function getJob(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("createdBy", "email roles");
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    return res.json({
      success: true,
      message: "Job fetched",
      job,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function getRecommendedJobs(req, res) {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const skills = Array.isArray(student?.skills) ? student.skills.map((s) => s.toLowerCase()) : [];
    const jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
    const result = [];
    jobs.forEach((job) => {
      const alreadyApplied = (job.applications || []).some(
        (app) => app.applicant.toString() === req.user.id
      );
      if (alreadyApplied) return;
      const jobSkills = Array.isArray(job.skills) ? job.skills.map((s) => s.toLowerCase()) : [];
      const overlap = skills.filter((s) => jobSkills.includes(s));
      const score = overlap.length;
      if (score > 0) {
        result.push({
          _id: job._id,
          title: job.title,
          description: job.description,
          skills: job.skills,
          location: job.location,
          jobType: job.jobType,
          salaryFrom: job.salaryFrom,
          salaryTo: job.salaryTo,
          matchScore: score,
        });
      }
    });
    result.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({
      success: true,
      message: "Recommended jobs fetched",
      jobs: result,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

async function listMyJobs(req, res) {
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: "Jobs fetched",
      jobs,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function applyToJob(req, res) {
  try {
    console.log("Apply to Job - User:", req.user); // Debug
    console.log("Apply to Job - Job ID:", req.params.id); // Debug
    const { id } = req.params;
    // Handle case where body might be undefined
    const { coverLetter, resumeUrl } = req.body || {};
    const job = await Job.findById(id);
    if (!job || job.status !== "open") {
      console.log("Apply to Job - Job not found or not open"); // Debug
      return res
        .status(400)
        .json({ success: false, message: "Job not open for applications" });
    }
    const already = job.applications.find(
      (app) => app.applicant.toString() === req.user.id
    );
    if (already) {
      console.log("Apply to Job - Already applied"); // Debug
      return res
        .status(400)
        .json({ success: false, message: "Already applied to this job" });
    }
    job.applications.push({
      applicant: req.user.id,
      coverLetter,
      resumeUrl,
    });
    await job.save();
    console.log("Apply to Job - SUCCESS! Application saved"); // Debug
    return res.status(201).json({
      success: true,
      message: "Applied to job",
      job,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal error: " + err.message });
  }
}

async function withdrawApplication(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const idx = job.applications.findIndex((app) => app.applicant.toString() === req.user.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    const status = job.applications[idx].status;
    if (status === "hired" || status === "rejected") {
      return res.status(400).json({ success: false, message: "Cannot withdraw at current status" });
    }
    job.applications.splice(idx, 1);
    await job.save();
    return res.json({ success: true, message: "Application withdrawn" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

async function getMyApplications(req, res) {
  try {
    console.log("Get My Applications - User ID:", req.user.id);

    const jobs = await Job.find({
      "applications.applicant": req.user.id
    }).select("title company location jobType salaryFrom salaryTo applications createdAt");

    console.log("Get My Applications - Found", jobs.length, "jobs"); // Debug

    // Filter and format the applications for this user
    const myApplications = jobs.map(job => {
      const application = job.applications.find(
        app => app.applicant.toString() === req.user.id
      );

      console.log("Get My Applications - Job:", job.title, "Status:", application.status); // Debug

      return {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        salary: job.salaryFrom && job.salaryTo ? `$${job.salaryFrom} - $${job.salaryTo}` : null,
        applicationStatus: application.status,
        appliedAt: application.createdAt,
        updatedAt: application.updatedAt
      };
    });

    // Sort by most recent first
    myApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    console.log("Get My Applications - Returning", myApplications.length, "applications"); // Debug
    console.log("Get My Applications - Statuses:", myApplications.map(a => a.applicationStatus)); // Debug

    return res.json({
      success: true,
      message: "Applications fetched",
      applications: myApplications
    });
  } catch (err) {
    console.error("Get My Applications Error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

async function getApplicantsForJob(req, res) {
  try {
    const { id } = req.params;
    console.log("Get Applicants - Job ID:", id, "Recruiter ID:", req.user.id); // Debug
    const job = await Job.findOne({ _id: id, createdBy: req.user.id }).populate(
      "applications.applicant",
      "email"
    );
    if (!job) {
      console.log("Get Applicants - Job not found"); // Debug
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    console.log("Get Applicants - Found job with", job.applications.length, "applications"); // Debug
    const userIds = job.applications
      .map((app) => app.applicant && app.applicant._id)
      .filter(Boolean);
    const uniqueUserIds = [...new Set(userIds.map((id) => id.toString()))];
    const studentProfiles = await Student.find({
      user: { $in: uniqueUserIds },
    });
    console.log("Get Applicants - Found", studentProfiles.length, "student profiles"); // Debug
    const profileByUserId = new Map();
    studentProfiles.forEach((profile) => {
      profileByUserId.set(profile.user.toString(), profile);
    });
    const result = job.applications.map((app) => {
      const applicantId = app.applicant && app.applicant._id
        ? app.applicant._id.toString()
        : app.applicant.toString();
      const profile = profileByUserId.get(applicantId) || null;
      return {
        applicant: {
          id: applicantId,
          email: app.applicant.email,
          studentProfile: profile,
        },
        status: app.status,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
        appliedAt: app.createdAt,
      };
    });
    console.log("Get Applicants - Returning", result.length, "applicants"); // Debug
    return res.json({
      success: true,
      message: "Applicants fetched",
      applicants: result,
    });
  } catch (err) {
    console.error("Get Applicants Error:", err); // Debug
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { id, applicantId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["applied", "shortlisted", "accepted", "rejected", "hired"];
    if (!status || !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }
    const job = await Job.findOne({ _id: id, createdBy: req.user.id });
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    const app = job.applications.find(
      (a) => a.applicant.toString() === applicantId
    );
    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    const currentStatus = app.status;
    if (currentStatus === status) {
      return res.status(400).json({
        success: false,
        message: "Status is already " + status,
      });
    }
    const allowedTransitions = {
      applied: ["shortlisted", "accepted", "rejected"],
      shortlisted: ["accepted", "hired", "rejected"],
      accepted: ["hired", "rejected"],
      rejected: [],
      hired: [],
    };
    const allowedNext = allowedTransitions[currentStatus] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot change status from \"" +
          currentStatus +
          "\" to \"" +
          status +
          "\"",
      });
    }
    app.status = status;
    await job.save();
    const user = await User.findById(app.applicant);
    if (user) {
      await sendApplicationStatusEmail(user.email, job.title, status);
    }
    return res.json({
      success: true,
      message: "Application status updated",
      application: app,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

module.exports = {
  createJob,
  updateJob,
  listJobs,
  getJob,
  getRecommendedJobs,
  listMyJobs,
  applyToJob,
  withdrawApplication,
  getApplicantsForJob,
  updateApplicationStatus,
  getMyApplications,
};
