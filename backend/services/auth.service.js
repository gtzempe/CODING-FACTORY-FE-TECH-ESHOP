const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    roles: user.roles,
  };

  const secret = process.env.JWT_SECRET;

  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
};

exports.verifyAccessToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (err) {
    return { success: false, data: err.message };
  }
};
