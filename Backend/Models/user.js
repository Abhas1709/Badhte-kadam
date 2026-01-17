const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true },
    passwordHash: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["student", "recruiter", "admin"],
      default: ["student"],
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

