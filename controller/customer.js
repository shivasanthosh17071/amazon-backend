const usersSchema = require("../model/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { Email, PhoneNumber, Password } = req.body;

    // Check if email or phone already exists
    const existingUser = await usersSchema.findOne({
      $or: [{ Email }, { PhoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email or Phone number already registered",
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(Password, 10);
    req.body.Password = hashedPassword;

    // Save new user
    const user = new usersSchema(req.body);
    const userDetails = await user.save();

    return res.json({
      success: "Registered successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const usersDetails = await usersSchema.findOne({ Email });
    if (!usersDetails) {
      return res.json({ Message: "No user registered with this email" });
    }

    const passwordResult = bcrypt.compareSync(Password, usersDetails.Password);
    if (!passwordResult) {
      return res.json({ Message: "Wrong password" });
    }

    const token = jwt.sign(
      { Email: usersDetails.Email, Role: usersDetails.Role },
      "shh"
    );

    return res.json({ Success: "Login success", token, usersDetails });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await usersSchema.find();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { signup, login, getUsers };
