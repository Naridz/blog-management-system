const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
}