const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❗ validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // ✅ check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ role logic (YOUR RULE)
    const role = email.endsWith("@arnifi.com") ? "admin" : "user";

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, role`,
      [email, hashedPassword, role]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Signup error" });
  }
};


// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❗ validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // ✅ compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // ✅ create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ❗ remove password before sending
    delete user.password;

    res.json({ token, user });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Login error" });
  }
};