import Product from "../models/product.js";
import { createPagination, getPagination } from "../utils/pagination.js";
import cloudinary from "../config/cloudinary.js";


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

    if (req.query.category?.trim() && req.query.category.trim().toLowerCase() !== "all") {
      filter.category = { $regex: `^${req.query.category.trim()}$`, $options: "i" };
    }

    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const hasMinPrice = req.query.minPrice !== undefined && Number.isFinite(minPrice) && minPrice >= 0;
    const hasMaxPrice = req.query.maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice >= 0;

    if (hasMinPrice || hasMaxPrice) {
      filter.price = {
        ...(hasMinPrice && { $gte: minPrice }),
        ...(hasMaxPrice && { $lte: maxPrice }),
      };
    }

    let sortQuery = { _id: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "oldest":
          sortQuery = { _id: 1 };
          break;
        case "lowest_price":
        case "price_asc":
          sortQuery = { price: 1 };
          break;
        case "highest_price":
        case "price_desc":
          sortQuery = { price: -1 };
          break;
        case "highest_rating":
        case "rating_desc":
          sortQuery = { rating: -1 };
          break;
        case "lowest_rating":
        case "rating_asc":
          sortQuery = { rating: 1 };
          break;
        case "name_asc":
          sortQuery = { productName: 1 };
          break;
        case "name_desc":
          sortQuery = { productName: -1 };
          break;
        case "newest":
        default:
          sortQuery = { _id: -1 };
          break;
      }
    }

    const total = await Product.countDocuments(filter);
    const pagination = createPagination({ page, limit, total });
    const products = await Product.find(filter)
      .sort(sortQuery)
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

// GET PRODUCT STATS
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const menProducts = await Product.countDocuments({
      category: { $regex: /^men$/i },
    });
    const womenProducts = await Product.countDocuments({
      category: { $regex: /^women$/i },
    });
    const unisexProducts = await Product.countDocuments({
      category: { $regex: /^unisex$/i },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        menProducts,
        womenProducts,
        unisexProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product statistics",
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


// UPLOAD PRODUCT IMAGE (Signed Cloudinary Upload)
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file to upload",
      });
    }

    // Convert file buffer to base64 Data URI for Cloudinary
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "products",
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductStats,
  getSingleProduct,
  uploadProductImage,
};

