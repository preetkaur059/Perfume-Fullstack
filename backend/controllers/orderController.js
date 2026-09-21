import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";

const orderPopulate = [
  {
    path: "user",
    select: "fullName email isAdmin",
  },
  {
    path: "orderItems.product",
    select: "productName price image category",
  },
];

const validateOrderItems = async (orderItems) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return "orderItems must be a non-empty array.";
  }

  for (const item of orderItems) {
    if (
      !item ||
      !mongoose.isValidObjectId(item.product)
    ) {
      return "Each order item must include a valid product ID.";
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return "Each order item quantity must be a whole number of at least 1.";
    }
  }

  const productIds = [
    ...new Set(
      orderItems.map((item) =>
        item.product.toString()
      )
    ),
  ];

  const productCount =
    await Product.countDocuments({
      _id: { $in: productIds },
    });

  if (productCount !== productIds.length) {
    return "One or more products do not exist.";
  }

  return null;
};


// ===============================
// CREATE ORDER
// ===============================

const createOrder = async (req, res) => {
  try {
    const validationError =
      await validateOrderItems(
        req.body.orderItems
      );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      orderItems: req.body.orderItems,
      status:
        req.body.status || "Processing",
    });

    await order.populate(orderPopulate);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// ===============================
// CUSTOMER - GET OWN ORDERS
// ===============================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// ===============================
// GET SINGLE ORDER
// ===============================

const getOrderById = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate(orderPopulate);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


// ===============================
// UPDATE ORDER
// ===============================

const updateOrder = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.body.orderItems) {
      const validationError =
        await validateOrderItems(
          req.body.orderItems
        );

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      order.orderItems =
        req.body.orderItems;
    }

    if (req.body.status) {
      order.status = req.body.status;
    }

    await order.save();

    await order.populate(orderPopulate);

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};


// ===============================
// DELETE ORDER
// ===============================

const deleteOrder = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};


// ===============================
// ADMIN - GET ALL ORDERS
// ===============================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};


// ===============================
// ADMIN - GET SINGLE ORDER
// ===============================

const getAdminOrderById = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(
      req.params.id
    ).populate(orderPopulate);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


// ===============================
// ADMIN - UPDATE ORDER
// ===============================

const updateAdminOrder = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.body.orderItems) {
      const validationError =
        await validateOrderItems(
          req.body.orderItems
        );

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      order.orderItems =
        req.body.orderItems;
    }

    if (req.body.status) {
      order.status = req.body.status;
    }

    await order.save();

    await order.populate(orderPopulate);

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};


// ===============================
// ADMIN - DELETE ORDER
// ===============================

const deleteAdminOrder = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,

  getAllOrders,
  getAdminOrderById,
  updateAdminOrder,
  deleteAdminOrder,
};