const mongoose = require("mongoose");

// Item schema reused for Cart and Orders
const itemSchema = new mongoose.Schema(
  {
    ProductId: String,
    Title: String,
    Price: Number,
    Quantity: Number,
    Thumbnail: String,
  },
  { _id: false }
);

// Orders schema
const orderSchema = new mongoose.Schema(
  {
    customerId: String,
    items: [itemSchema],
    totalAmount: Number,
    paymentMethod: String, // "UPI" or "Pay on Delivery"
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Processing",
    },
    address: {
      line1: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
  },
  { _id: false }
);

// Main user schema
const usersSchema = new mongoose.Schema(
  {
    Name: { type: String },
    Email: { type: String },
    PhoneNumber: { type: Number },
    Role: { type: Number },
    Password: { type: String },
    Age: { type: String },
    Address: { type: String },
    Gender: { type: String },

    // Extra fields for e-commerce
    cartItems: [itemSchema],
    orders: [orderSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", usersSchema);
