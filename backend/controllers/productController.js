import Product from "../models/product.js";
import { createPagination, getPagination } from "../utils/pagination.js";


// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      productName, price, category, rating, description, image } = req.body;

    if (!productName || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Product name, price and category are required", 
      });
    }

    // Create product
    const product = await Product.create({ productName, price, category, rating, description, image });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const filter = {};

    if (req.query.search?.trim()) {
      filter.productName = { $regex: req.query.search.trim(), $options: "i" };
    }

    if (req.query.category?.trim()) {
      filter.category = { $regex: `^${req.query.category.trim()}$`, $options: "i" };
    }

    const total = await Product.countDocuments(filter);
    const pagination = createPagination({ page, limit, total });
    const products = await Product.find(filter)
      .sort({ _id: -1 })
      .skip((pagination.page - 1) * limit)
      .limit(limit);

    return res.status(200).json({ success: true, data: products, pagination });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

//get single product 

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
};
