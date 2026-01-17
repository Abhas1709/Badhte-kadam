const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const {
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
} = require("../controllers/jobController");

const router = express.Router();

// Specific routes MUST come before parameterized routes
router.get("/me/my-jobs", auth, requireRole("recruiter"), listMyJobs);
router.get("/me/my-applications", auth, requireRole("student"), getMyApplications);
router.get("/me/recommended", auth, requireRole("student"), getRecommendedJobs);

// General routes
router.get("/", listJobs);
router.get("/:id", getJob);

router.post("/", auth, requireRole("recruiter"), createJob);
router.put("/:id", auth, requireRole("recruiter"), updateJob);
router.get("/:id/applicants", auth, requireRole("recruiter"), getApplicantsForJob);
router.patch(
  "/:id/applications/:applicantId/status",
  auth,
  requireRole("recruiter"),
  updateApplicationStatus
);

router.post("/:id/apply", auth, requireRole("student"), applyToJob);
router.delete("/:id/apply", auth, requireRole("student"), withdrawApplication);

module.exports = router;

