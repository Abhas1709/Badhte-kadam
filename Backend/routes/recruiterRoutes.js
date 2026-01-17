const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const { getProfile, upsertProfile, getPublicProfile } = require("../controllers/recruiterController");

const router = express.Router();

router.get("/me", auth, requireRole("recruiter"), getProfile);
router.put("/me", auth, requireRole("recruiter"), upsertProfile);
router.get("/public/:userId", getPublicProfile);

module.exports = router;

