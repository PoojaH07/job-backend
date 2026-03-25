const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret123";

// ✅ Verify token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

// ✅ Admin check
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Admin only");
  }
  next();
};

