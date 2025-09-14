const authService = require("../services/auth.service");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Access Denied. No token provided" });
  }

  const result = authService.verifyAccessToken(token);

  if (!result.success) {
    return res.status(403).json({ status: false, data: result.data });
  }
  req.user = result.data;

  next();
}

function verifyRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res
        .status(403)
        .json({ status: false, data: "Forbidden: no roles found" });
    }

    const userRoles = req.user.roles;
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return res
        .status(403)
        .json({ status: false, data: "Forbidden: insufficient permissions" });
    }

    next();
  };
}

function verifyMe(req, res, next) {
  console.log("User is verified:", req.user);
  req.params.username = req.user.username;

  next();
}

module.exports = { verifyToken, verifyRoles, verifyMe };
