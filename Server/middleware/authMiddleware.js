const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Auth is not configured" });
    }

    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user || req.user.isActive === false) {
        return res.status(401).json({ message: "User is not authorized" });
      }

      next();
    } else {
      res.status(401).json({ message: "No token" });
    }
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Not authorized" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};

module.exports = { protect, isAdmin };
