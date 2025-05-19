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

let login = async (req, res) => {
  let { Email, Password } = req.body;

  let usersDetails = await usersSchema.findOne({ Email: Email });
  if (usersDetails == null) {
    return res.json({
      Message: " no users registered with this email",
    });
  }
  passwordResult = bcrypt.compareSync(Password, usersDetails.Password);
  console.log(passwordResult);
  if (passwordResult == false) {
    return res.json({
      Message: " wrong password ",
    });
  }
  console.log(usersDetails);

  let token = jwt.sign(
    { Email: usersDetails.Email, Role: usersDetails.Role },
    "shh"
  );

  return res.json({ Success: "Login success", token, usersDetails });
};

let getUsers = async (req, res) => {
  let users = await usersSchema.find();
  res.json(users);
};

module.exports = { signup, login, getUsers };
