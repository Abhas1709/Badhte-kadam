const Recruiter = require("../Models/recurter");

const User = require("../Models/user");

async function getProfile(req, res) {
  try {
    const profile = await Recruiter.findOne({ user: req.user.id });
    if (!profile) return res.json(null);
    const user = await User.findById(req.user.id);
    const combined = {
      ...profile.toObject(),
      email: user?.email || null,
    };
    return res.json(combined);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
}

async function upsertProfile(req, res) {
  try {
    const { companyName, companyWebsite, companyLocation, about } = req.body;
    const update = {
      companyName,
      companyWebsite,
      companyLocation,
      about,
    };
    const profile = await Recruiter.findOneAndUpdate(
      { user: req.user.id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
}

async function getPublicProfile(req, res) {
  try {
    const { userId } = req.params;
    const profile = await Recruiter.findOne({ user: userId });
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
  getPublicProfile,
};

