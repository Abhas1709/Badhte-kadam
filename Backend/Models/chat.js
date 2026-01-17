const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
