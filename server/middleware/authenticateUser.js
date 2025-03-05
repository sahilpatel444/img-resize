const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ensure user ID is properly set
    console.log("Decoded User:", decoded); // Debugging line
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};

module.exports = authenticateUser;
