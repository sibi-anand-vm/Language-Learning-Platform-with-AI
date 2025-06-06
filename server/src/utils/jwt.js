const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.usermail }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
