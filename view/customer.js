<<<<<<< HEAD
const express = require("express");
const CustomerRouter = express.Router();
const usersSchema = require("../model/customer");
const { signup, login, getUsers } = require("../controller/customer");
const jwt = require("jsonwebtoken");

CustomerRouter.post("/signup", signup);
CustomerRouter.post("/login", login);
CustomerRouter.post("/:id/addToCart", async (req, res) => {
  const userId = req.params.id;
  const { Id: ProductId, Title, Price, Thumbnail } = req.body;

  try {
    const user = await usersSchema.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.ProductId === ProductId
    );

    if (existingItemIndex !== -1) {
      // If item exists, increment the quantity
      user.cartItems[existingItemIndex].Quantity += 1;
    } else {
      // Else, push new item to cart
      const cartItem = {
        ProductId,
        Title,
        Price: Number(Price),
        Quantity: 1,
        Thumbnail,
      };
      user.cartItems.push(cartItem);
    }

    await user.save();

    res.json({ message: "Cart updated", cartItems: user.cartItems });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CustomerRouter.delete(
//   "/deleteCartItem/:userId/:productId",
//   async (req, res) => {
//     const { userId, productId } = req.params;

//     try {
//       const user = await usersSchema.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       let cart = user.cartItems;
//       let found = false;

//       // Loop from the end and use splice to delete matching items
//       for (let i = cart.length - 1; i >= 0; i--) {
//         if (cart[i].ProductId === productId) {
//           cart.splice(i, 1);
//           found = true;
//         }
//       }

//       if (!found) {
//         return res
//           .status(404)
//           .json({ message: "No matching items found in cart" });
//       }

//       await user.save();

//       res.status(200).json({
//         message: "Matching cart item(s) deleted successfully",
//         cartItems: user.cartItems,
//       });
//     } catch (error) {
//       console.error("Error deleting cart item:", error);
//       res.status(500).json({ message: "Server error", error });
//     }
//   }
// );

CustomerRouter.get("/:userId/cart", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await usersSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      cartItems: user.cartItems || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
=======
const express = require('express')
const CustomerRouter = express.Router()
const usersSchema = require('../model/customer')
const {signup,login ,getUsers} = require('../controller/customer')
const jwt = require('jsonwebtoken')

CustomerRouter.post('/signup', signup )
CustomerRouter.post( '/login' , login )

>>>>>>> 4ba61d310ac9da92254bdc9552881ba212636e5d
// CustomerRouter.get('/getUsers', (req,res,next)=>{
//    let token = (req.headers.authorization)
//    if(!token){
//     res.json({Message :" Token is required"})
//    }
<<<<<<< HEAD

//    try{ let result = jwt.verify( token, "shh")
//     console.log(result)
//     if(result.Role == 1 ){
//     next();
=======
  
//    try{ let result = jwt.verify( token, "shh")
//     console.log(result)
//     if(result.Role == 1 ){
//     next(); 
>>>>>>> 4ba61d310ac9da92254bdc9552881ba212636e5d
//     } else{
//     return res.json({
//         message : " You are not a Admin ,only admins can access"
//     })
//     }
<<<<<<< HEAD

//      } catch(err){
//     res.json(err);
//    }

=======
   
//      } catch(err){
//     res.json(err);
//    }
 
>>>>>>> 4ba61d310ac9da92254bdc9552881ba212636e5d
//     return console.log("testing")
// } , getUsers )
CustomerRouter.get("/getUsers", getUsers);

<<<<<<< HEAD
// Increase Item Quantity
CustomerRouter.put("/increaseQuantity/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find user by ID
    const user = await usersSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the item in the cart and increment the quantity
    const item = user.cartItems.find((item) => item.ProductId === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.Quantity += 1; // Increase the quantity by 1

    // Save the user document with the updated cart
    await user.save();

    return res
      .status(200)
      .json({ message: "Item quantity increased", cartItems: user.cartItems });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Decrease Item Quantity (and remove if quantity reaches 0)
CustomerRouter.put("/decreaseQuantity/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find user by ID
    const user = await usersSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the item in the cart and decrement the quantity
    const item = user.cartItems.find((item) => item.ProductId === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (item.Quantity === 1) {
      // If quantity is 1, remove the item from the cart
      user.cartItems = user.cartItems.filter(
        (item) => item.ProductId !== productId
      );
    } else {
      // Otherwise, just decrease the quantity by 1
      item.Quantity -= 1;
    }

    // Save the user document with the updated cart
    await user.save();

    return res
      .status(200)
      .json({ message: "Item quantity decreased", cartItems: user.cartItems });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});
//  user orders
CustomerRouter.post("/:userId/order", async (req, res) => {
  const { userId } = req.params;
  const { items, totalAmount, paymentMethod, status, address } = req.body;
  const adminEmail = "shivasanthoshqt@gmail.com";
  const newOrder = {
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

    // Send notification to seller
    // sendEmail(
    //   adminEmail,
    //   "New Order Received"
    //   // `You have a new order for ${product.title}.`
    // );
    // res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});
// PUT request to update user details
CustomerRouter.put("/updateuser", async (req, res) => {
  const { Email } = req.body; // Assuming you are sending the user's Email to identify them
  const updateData = req.body;

  try {
    const user = await usersSchema.findOneAndUpdate({ Email }, updateData, {
      new: true,
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating user data", error: err.message });
  }
});

module.exports = CustomerRouter;
=======
module.exports= CustomerRouter
>>>>>>> 4ba61d310ac9da92254bdc9552881ba212636e5d
