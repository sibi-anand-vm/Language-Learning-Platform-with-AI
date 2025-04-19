const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { username, usermail, password } = req.body;

  try {
  
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(usermail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existing = await User.findOne({ usermail });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, usermail, password});
    await user.save();

    res.status(201).json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { usermail, password } = req.body;

  try {
    const user = await User.findOne({ usermail: usermail.trim() });

    if (!user) {
      console.log("User not found for email:", usermail);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("Compare result:", valid);

    if (!valid) {
      console.log("Invalid password. Entered:", password, "Stored:", user.password);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


