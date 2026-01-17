const Chat = require("../Models/chat");
const Job = require("../Models/job");

async function ensureAccess(userId, jobId, applicantId) {
  const job = await Job.findById(jobId);
  if (!job) return false;
  const isRecruiter = job.createdBy.toString() === userId;
  const isApplicant = applicantId.toString() === userId;
  const app = (job.applications || []).find((a) => a.applicant.toString() === applicantId.toString());
  if (!app) return false;
  const allowedStatuses = ["shortlisted", "accepted", "hired"];
  if (!allowedStatuses.includes(app.status)) return false;
  return isRecruiter || isApplicant;
}

async function getMessages(req, res) {
  try {
    const { jobId, applicantId } = req.params;
    const ok = await ensureAccess(req.user.id, jobId, applicantId);
    if (!ok) return res.status(403).json({ success: false, message: "Forbidden" });
    let chat = await Chat.findOne({ jobId, applicantId });
    if (!chat) {
      chat = await Chat.create({
        jobId,
        applicantId,
        participants: [applicantId, req.user.id],
        messages: [],
      });
    }
    return res.json({ success: true, messages: chat.messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

async function postMessage(req, res) {
  try {
    const { jobId, applicantId } = req.params;
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, message: "Invalid message" });
    }
    const ok = await ensureAccess(req.user.id, jobId, applicantId);
    if (!ok) return res.status(403).json({ success: false, message: "Forbidden" });
    let chat = await Chat.findOne({ jobId, applicantId });
    if (!chat) {
      chat = await Chat.create({
        jobId,
        applicantId,
        participants: [applicantId, req.user.id],
        messages: [],
      });
    }
    chat.messages.push({ sender: req.user.id, text });
    await chat.save();
    return res.status(201).json({ success: true, message: "Message sent" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

module.exports = { getMessages, postMessage };
