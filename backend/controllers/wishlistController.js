import mongoose from "mongoose";
import Wishlist from "../models/wishlist.js";
import Product from "../models/product.js";

const formatWishlistProducts = (wishlist) => {
  if (!wishlist || !Array.isArray(wishlist.products)) return [];
  return wishlist.products
    .filter((product) => product != null)
    .map((product) => {
      const prod = product.toObject ? product.toObject() : product;
      const prodId = prod._id?.toString() || prod.id;
      return {
        ...prod,
        _id: prodId,
      };
    });
};

// GET /wishlist - Get logged-in user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const products = formatWishlistProducts(wishlist);

    return res.status(200).json({
      success: true,
      wishlist: products,
      items: products,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};

// POST /wishlist - Add product to wishlist (no duplicates)
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const targetProductId = req.body.productId || req.body._id || req.body.id;

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

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const alreadyInWishlist = wishlist.products.some(
      (id) => id.toString() === targetProductId.toString()
    );

    if (!alreadyInWishlist) {
      wishlist.products.push(targetProductId);
      await wishlist.save();
    }

    await wishlist.populate("products");
    const products = formatWishlistProducts(wishlist);

    return res.status(200).json({
      success: true,
      msg: alreadyInWishlist
        ? "Product is already in wishlist"
        : "Product added to wishlist",
      wishlist: products,
      items: products,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add to wishlist",
      error: error.message,
    });
  }
};

// DELETE /wishlist/:productId - Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        msg: "Valid product ID is required",
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: [],
        items: [],
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();
    await wishlist.populate("products");

    const products = formatWishlistProducts(wishlist);

    return res.status(200).json({
      success: true,
      msg: "Product removed from wishlist",
      wishlist: products,
      items: products,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to remove from wishlist",
      error: error.message,
    });
  }
};

// GET /wishlist/check/:productId - Check whether product is already in wishlist
export const checkInWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        msg: "Valid product ID is required",
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    const inWishlist = wishlist
      ? wishlist.products.some((id) => id.toString() === productId.toString())
      : false;

    return res.status(200).json({
      success: true,
      inWishlist,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to check wishlist status",
      error: error.message,
    });
  }
};
