import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

const formatCartItems = (cart) => {
  if (!cart || !Array.isArray(cart.items)) return [];
  return cart.items
    .filter((item) => item.product != null)
    .map((item) => {
      const prod = item.product.toObject ? item.product.toObject() : item.product;
      const prodId = prod._id?.toString() || prod.id;
      return {
        ...prod,
        _id: prodId,
        productId: prodId,
        quantity: item.quantity,
      };
    });
};

// GET /cart - Get logged-in user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const items = formatCartItems(cart);

    return res.status(200).json({
      success: true,
      items,
      cart: items,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch cart",
      error: error.message,
    });
  }
};

// POST /cart - Add product to cart (or increase quantity if already exists)
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    const targetProductId = productId || req.body._id || req.body.id;

    if (!targetProductId || !mongoose.Types.ObjectId.isValid(targetProductId)) {
      return res.status(400).json({
        success: false,
        msg: "Valid product ID is required",
      });
    }

    const product = await Product.findById(targetProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === targetProductId.toString()
    );

    if (existingItemIndex > -1) {
      // Increase quantity instead of creating duplicate
      cart.items[existingItemIndex].quantity += qtyToAdd;
    } else {
      cart.items.push({
        product: targetProductId,
        quantity: qtyToAdd,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    const items = formatCartItems(cart);

    return res.status(200).json({
      success: true,
      msg: "Item added to cart",
      items,
      cart: items,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add item to cart",
      error: error.message,
    });
  }
};

// PATCH /cart/:productId - Update item quantity (increment, decrement, or set)
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity, action, delta } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        msg: "Valid product ID is required",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: "Product not found in cart",
      });
    }

    let newQuantity = cart.items[itemIndex].quantity;

    if (typeof quantity === "number") {
      newQuantity = quantity;
    } else if (action === "increase" || action === "increment") {
      newQuantity += 1;
    } else if (action === "decrease" || action === "decrement") {
      newQuantity -= 1;
    } else if (typeof delta === "number") {
      newQuantity += delta;
    }

    if (newQuantity <= 0) {
      // Remove item if quantity falls to 0 or below
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQuantity;
    }

    await cart.save();
    await cart.populate("items.product");

    const items = formatCartItems(cart);

    return res.status(200).json({
      success: true,
      msg: "Cart updated",
      items,
      cart: items,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to update cart",
      error: error.message,
    });
  }
};

// DELETE /cart/:productId - Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        msg: "Valid product ID is required",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        cart: [],
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    await cart.populate("items.product");

    const items = formatCartItems(cart);

    return res.status(200).json({
      success: true,
      msg: "Item removed from cart",
      items,
      cart: items,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

// DELETE /cart - Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      msg: "Cart cleared successfully",
      items: [],
      cart: [],
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to clear cart",
      error: error.message,
    });
  }
};
