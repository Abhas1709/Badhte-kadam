const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true },
    code: { type: String, required: true },
    type: {
      type: String,
      enum: ["verify", "reset"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;

