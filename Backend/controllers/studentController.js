const Student = require("../Models/student");
const User = require("../Models/user");

async function getProfile(req, res) {
  try {
    const profile = await Student.findOne({ user: req.user.id });
    return res.json(profile || null);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
}

async function upsertProfile(req, res) {
  try {
    const { fullName, education, skills, bio, resumeUrl } = req.body;
    const update = {
      fullName,
      education,
      skills,
      bio,
      resumeUrl,
    };
    const profile = await Student.findOneAndUpdate(
      { user: req.user.id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
}

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const url = `/uploads/resumes/${req.file.filename}`;
    const profile = await Student.findOneAndUpdate(
      { user: req.user.id },
      { resumeUrl: url },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ success: true, message: "Resume uploaded", resumeUrl: url, profile });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

async function getPublicProfile(req, res) {
  try {
    const { userId } = req.params;
    const profile = await Student.findOne({ user: userId });
    if (!profile) return res.status(404).json({ success: false, message: "Not found" });
    const user = await User.findById(userId);
    const combined = {
      ...profile.toObject(),
      email: user?.email || null,
    };
    return res.json({ success: true, profile: combined });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

module.exports = {
  getProfile,
  upsertProfile,
  uploadResume,
  getPublicProfile,
};
