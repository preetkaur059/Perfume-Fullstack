import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

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

const getRequester = async (userId) => {
  return User.findById(userId).select("isAdmin");
};

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

const canManageOrder = (order, requester) =>
  requester.isAdmin ||
  order.user.equals(requester._id);


// ===============================
// CREATE ORDER
// ===============================

const createOrder = async (req, res) => {
  try {
    const requester = await getRequester(
      req.user.userId
    );

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

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

    let userId = req.user.userId;

    // Admin can create order for another customer
    if (requester.isAdmin && req.body.user) {
      if (
        !mongoose.isValidObjectId(req.body.user)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID.",
        });
      }

      const customer = await User.findById(
        req.body.user
      );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found.",
        });
      }

      userId = customer._id;
    }

    const order = await Order.create({
      user: userId,
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
// GET ALL ORDERS
// ===============================

const getOrders = async (req, res) => {
  try {
    const requester = await getRequester(
      req.user.userId
    );

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const filter = requester.isAdmin
      ? {}
      : { user: requester._id };

    const orders = await Order.find(filter)
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

    const [requester, order] =
      await Promise.all([
        getRequester(req.user.userId),
        Order.findById(req.params.id),
      ]);

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !canManageOrder(order, requester)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await order.populate(orderPopulate);

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

    const [requester, order] =
      await Promise.all([
        getRequester(req.user.userId),
        Order.findById(req.params.id),
      ]);

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !canManageOrder(order, requester)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    // Update order items if provided
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

    // Update status if provided
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

    const [requester, order] =
      await Promise.all([
        getRequester(req.user.userId),
        Order.findById(req.params.id),
      ]);

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !canManageOrder(order, requester)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
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
};