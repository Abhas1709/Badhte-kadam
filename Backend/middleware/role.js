function requireRole(...allowedRoles) {
  return (req, res, next) => {
    console.log("Role Middleware - Checking roles:", { userRoles: req.user?.roles, allowedRoles }); // Debug
    if (!req.user || !Array.isArray(req.user.roles)) {
      console.log("Role Middleware - FORBIDDEN: No user or roles not array"); // Debug
      return res.status(403).json({ message: "Forbidden" });
    }
    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      console.log("Role Middleware - FORBIDDEN: User doesn't have required role"); // Debug
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log("Role Middleware - PASSED"); // Debug
    next();
  };
}

module.exports = requireRole;

