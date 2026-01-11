const Student = require("../Models/student");

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

module.exports = {
  getProfile,
  upsertProfile,
};

