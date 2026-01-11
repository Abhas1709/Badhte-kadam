const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const { getProfile, upsertProfile } = require("../controllers/studentController");

const router = express.Router();

router.get("/me", auth, requireRole("student"), getProfile);
router.put("/me", auth, requireRole("student"), upsertProfile);

module.exports = router;

