const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const { getProfile, upsertProfile, uploadResume, getPublicProfile } = require("../controllers/studentController");

const router = express.Router();

router.get("/me", auth, requireRole("student"), getProfile);
router.put("/me", auth, requireRole("student"), upsertProfile);
const resumeDir = path.join(__dirname, "../uploads/resumes");
try {
  fs.mkdirSync(resumeDir, { recursive: true });
} catch {}
const upload = multer({ dest: resumeDir });
router.post("/me/resume", auth, requireRole("student"), upload.single("file"), uploadResume);
router.get("/public/:userId", getPublicProfile);

module.exports = router;
