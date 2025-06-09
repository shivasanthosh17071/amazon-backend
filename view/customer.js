const express = require("express");
const CustomerRouter = express.Router();
const usersSchema = require("../model/customer");
const {
  signup,
  login,
  getUsers,
  orders,
  orderStatus,
} = require("../controller/customer");
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
// CustomerRouter.get('/getUsers', (req,res,next)=>{
//    let token = (req.headers.authorization)
//    if(!token){
//     res.json({Message :" Token is required"})
//    }

//    try{ let result = jwt.verify( token, "shh")
//     console.log(result)
//     if(result.Role == 1 ){
//     next();
//     } else{
//     return res.json({
//         message : " You are not a Admin ,only admins can access"
//     })
//     }

//      } catch(err){
//     res.json(err);
//    }

//     return console.log("testing")
// } , getUsers )
CustomerRouter.get("/getUsers", getUsers);

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
CustomerRouter.post("/:userId/order", orders);
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
//add wishlist
CustomerRouter.post("/addWishlist", async (req, res) => {
  // console.log(req.body);
  const { userId, newProduct } = req.body;
  // console.log("hi");
  // console.log(userId, newProduct);
  if (!userId || !newProduct) {
    return res.status(400).json({ message: "Missing userId or product data" });
  }

  try {
    const user = await usersSchema.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: check if product already in wishlist
    const alreadyExists = user.wishList.some(
      (item) => item.ProductId === newProduct.ProductId
    );
    if (alreadyExists) {
      return res
        .status(400)
        .json({ alreadyExists: "Product already in wishlist" });
    }

    user.wishList.push(newProduct);
    await user.save();

    return res
      .status(200)
      .json({ message: "Added to wishlist", wishList: user.wishList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
// Delete a product from wishlist
CustomerRouter.delete(
  "/deleteWishlist/:userId/:productId",
  async (req, res) => {
    const { userId, productId } = req.params;

    console.log(userId, productId);
    try {
      const user = await usersSchema.findByIdAndUpdate(
        userId,
        {
          $pull: { wishList: { ProductId: productId } },
        },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ data: req.body, message: "User not found." });
      }

      res.status(200).json({
        message: "Product removed from wishlist.",
        wishList: user.wishList,
      });
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);
//get wishlist
CustomerRouter.get("/getWishlist/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);
  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const user = await usersSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ wishList: user.wishList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
//
//

//
//
CustomerRouter.get("/orders", async (req, res) => {
  try {
    const users = await usersSchema.find({}, "Name Email orders");
    const orders = [];
    users.forEach((user) => {
      user.orders.forEach((order) => {
        orders.push({
          ...order.toObject(),
          customer: user.Name,
          email: user.Email,
          customerId: user._id,
        });
      });
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});
//
//

//
//
CustomerRouter.put("/order/status", orderStatus);

module.exports = CustomerRouter;
