const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret123"; // later move to .env

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check role
    const role = email.endsWith("@arnifi.com") ? "admin" : "user";

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup error");
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    delete user.password;

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
};