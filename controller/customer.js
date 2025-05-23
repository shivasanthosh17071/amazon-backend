const usersSchema = require("../model/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sa5@confluenceedu.com",
    pass: "bsal amqi akdi djot",
  },
});

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
const orders = async (req, res) => {
  const { userId } = req.params;
  const { customerId, items, totalAmount, paymentMethod, status, address } =
    req.body;

  const newOrder = {
    customerId,
    items,
    totalAmount,
    paymentMethod,
    status: status || "Confirmed",
    address,
  };

  try {
    const user = await usersSchema.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Add new order to orders array
    user.orders.push(newOrder);

    // Clear cart
    user.cartItems = [];

    await user.save();
    res
      .status(200)
      .json({ message: "Order placed successfully", order: newOrder });

    if (newOrder) {
      // tempelate
      const tempelate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        color: #000000;
      }
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #ddd;
        overflow:"scroll"
      }
      .header {
        background-color: #000000;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-height: 60px;
        margin-bottom: 10px;
      }
      .header h1 {
        margin: 0;
        color: #ff0000;
        font-size: 24px;
      }
      .content {
        padding: 20px;
      }
      .content h2 {
        color: #000000;
      }
      .order-details {
        margin: 0px;
        border-collapse: collapse;
        width: 100%;
             overflow:"scroll"
      }
      .order-details th,
      .order-details td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      .order-details th {
        background-color: #ff0000;
        color: #ffffff;
      }
      .footer {
        background-color: #000000;
        color: #ffffff;
        text-align: center;
        padding: 10px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <!-- 🔻 Replace the URL below with your actual logo URL -->
        <img
          src="https://blacknykee.onrender.com/static/media/BLacknykee.85b2af2a91327fe25fce.png"
          alt="Brand Logo"
        />

        <p style="color: #ffffff">Thank you for your order!</p>
      </div>

      <div class="content">
        <h2>Order Confirmation</h2>
        <p>Hello <strong>Customer</strong>,</p>
        <p>
          We're happy to let you know we've received your order. Here are the
          details:
        </p>

        <table class="order-details">
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Customer Id</th>
              <th>T.P</th>
            </tr>
          </thead>
          <tbody>
            <!-- Repeat this row for each product -->
            <tr>
              <td>${newOrder?.items[0]?.ProductId}<br/>${
        newOrder?.items[1]?.ProductId ? newOrder?.items[1]?.ProductId : ""
      }<br/>${
        newOrder?.items[2]?.ProductId ? newOrder?.items[2]?.ProductId : ""
      }</td>
              <td>${newOrder?.customerId}</td>
              <td>${newOrder?.items?.length}</td>
            </tr>

            <!-- End product list -->
              <tr>
              <td colspan="2"><strong>PaymentMethod</strong></td>
              <td><strong>${newOrder?.paymentMethod}</strong></td>
            </tr>
            <tr>
              <td colspan="2"><strong>Total</strong></td>
              <td><strong>${newOrder?.totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Shipping Address:</strong><br />
         ${newOrder?.address?.line1},
         ${newOrder?.address?.city},
         ${newOrder?.address?.state}
         ${newOrder?.address?.country}
         ${newOrder?.address?.postalCode}

        </p>

        <p>If you have any questions, feel free to reply to this email.</p>
      </div>

      <div class="footer">
        &copy; 2025 Your Brand Name — All rights reserved
      </div>
    </div>
  </body>
</html>
`;
      console.log(newOrder);
      const mailOptions = {
        from: "sa5@confluenceedu.com",
        to: "shivasanthoshqt@gmail.com",
        subject: "New Order from BLACKNYKEE",
        text: "This is a test email sent using Nodemailer!",
        html: tempelate, // You can send HTML instead of text
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log("Error:", error);
        }
        console.log("Email sent:", info.response);
      });
    }

    //
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
};
module.exports = { signup, login, getUsers, orders };
