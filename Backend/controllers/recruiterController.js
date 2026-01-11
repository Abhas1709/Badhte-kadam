const Recruiter = require("../Models/recurter");

async function getProfile(req, res) {
  try {
    const profile = await Recruiter.findOne({ user: req.user.id });
    return res.json(profile || null);
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

module.exports = {
  getProfile,
  upsertProfile,
};

