const jwt = require("jsonwebtoken");
const User = require("../Models/user");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Auth not configured" });
    }
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Auth Middleware - User:", { id: user._id, roles: user.roles, email: user.email }); // Debug
    req.user = {
      id: user._id.toString(),
      roles: user.roles,
      isVerified: user.isVerified,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;

