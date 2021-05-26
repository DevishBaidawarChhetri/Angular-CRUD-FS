const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // "userData", we created this to pass data
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authenticated!" });
  }
};
