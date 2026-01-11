const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/user");
const Otp = require("../Models/Otp");
const {
  sendVerificationOtpEmail,
  sendResetOtpEmail,
} = require("../services/emailService");

function generateOtp() {
  const num = crypto.randomInt(100000, 999999);
  return String(num);
}

function otpExpiryDate() {
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  return new Date(Date.now() + minutes * 60 * 1000);
}

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign(
    {
      id: user._id.toString(),
      roles: user.roles,
    },
    secret,
    { expiresIn }
  );
}

async function register(req, res) {
  try {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      roles: Array.isArray(roles) && roles.length ? roles : ["student"],
    });
    const code = generateOtp();
    await Otp.create({
      email: user.email,
      code,
      type: "verify",
      expiresAt: otpExpiryDate(),
    });
    await sendVerificationOtpEmail(user.email, code);
    return res.status(201).json({
      success: true,
      message: "Registered successfully. OTP sent for verification",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Email and code are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or code" });
    }
    const otpDoc = await Otp.findOne({
      email: user.email,
      code,
      type: "verify",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    await user.save();
    otpDoc.isUsed = true;
    await otpDoc.save();
    const token = signToken(user);
    return res.json({
      success: true,
      message: "Email verified",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }
    const code = generateOtp();
    await Otp.create({
      email: user.email,
      code,
      type: "verify",
      expiresAt: otpExpiryDate(),
    });
    await sendVerificationOtpEmail(user.email, code);
    return res.json({ success: true, message: "OTP resent" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Email not verified" });
    }
    const token = signToken(user);
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(200)
        .json({
          success: true,
          message: "If user exists, OTP is sent",
        });
    }
    const code = generateOtp();
    console.log(`Generated OTP for ${email}: ${code}`); // Debugging

    const otpData = {
      email: user.email,
      code,
      type: "reset",
      expiresAt: otpExpiryDate(),
    };

    const createdOtp = await Otp.create(otpData);
    console.log("OTP Saved to DB:", createdOtp); // Debugging

    await sendResetOtpEmail(user.email, code);
    return res.json({
      success: true,
      message: "If user exists, OTP is sent",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or code" });
    }
    const otpDoc = await Otp.findOne({
      email: user.email,
      code,
      type: "reset",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    otpDoc.isUsed = true;
    await otpDoc.save();
    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error" });
  }
}

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
};
