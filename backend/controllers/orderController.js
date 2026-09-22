import mongoose from "mongoose";
import { createPagination, getPagination } from "../utils/pagination.js";
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
// ADMIN - CREATE ORDER FOR A USER
// ===============================

const createAdminOrder = async (req, res) => {
  try {
    const customerId = req.body.user;

    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      return res.status(400).json({
        success: false,
        message: "A valid customer ID is required.",
      });
    }

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Selected customer does not exist.",
      });
    }

    const validationError = await validateOrderItems(req.body.orderItems);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const order = await Order.create({
      user: customer._id,
      orderItems: req.body.orderItems,
      status: req.body.status || "Processing",
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
    const { page, limit } = getPagination(req.query);
    const filter = { user: req.user.userId };
    const total = await Order.countDocuments(filter);
    const pagination = createPagination({ page, limit, total });
    const orders = await Order.find(filter)
      .populate(orderPopulate)
      .sort({ createdAt: -1 })
      .skip((pagination.page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination,
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
    const { page, limit } = getPagination(req.query);
    const { search, status, customer, sort = "newest" } = req.query;

    const filter = {};

    // 1. Status Filter
    if (status && status !== "All") {
      filter.status = status;
    }

    // 2. Customer Filter
    if (customer && customer !== "All" && mongoose.isValidObjectId(customer)) {
      filter.user = new mongoose.Types.ObjectId(customer);
    }

    // 3. Search Filter (by customer name, email, or order ID)
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const matchingUsers = await User.find({
        $or: [
          { fullName: { $regex: escapedSearch, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((u) => u._id);
      const searchOr = [];

      if (userIds.length > 0) {
        searchOr.push({ user: { $in: userIds } });
      }

      if (mongoose.isValidObjectId(trimmedSearch)) {
        searchOr.push({ _id: new mongoose.Types.ObjectId(trimmedSearch) });
      } else {
        searchOr.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: escapedSearch,
              options: "i",
            },
          },
        });
      }

      filter.$or = searchOr;
    }

    const total = await Order.countDocuments(filter);
    const pagination = createPagination({ page, limit, total });

    let sortOptions = { createdAt: -1 };
    let needsAmountSort = false;

    if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sort === "highest_amount" || sort === "lowest_amount") {
      needsAmountSort = true;
    }

    let orders;

    if (needsAmountSort) {
      const sortDirection = sort === "highest_amount" ? -1 : 1;
      orders = await Order.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $addFields: {
            totalAmount: {
              $sum: {
                $map: {
                  input: "$orderItems",
                  as: "item",
                  in: {
                    $multiply: [
                      { $ifNull: ["$$item.quantity", 1] },
                      {
                        $let: {
                          vars: {
                            matchedProduct: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$productDetails",
                                    as: "p",
                                    cond: { $eq: ["$$p._id", "$$item.product"] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: { $ifNull: ["$$matchedProduct.price", 0] },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        { $sort: { totalAmount: sortDirection, createdAt: -1 } },
        { $skip: (pagination.page - 1) * limit },
        { $limit: limit },
        { $project: { productDetails: 0 } },
      ]);

      await Order.populate(orders, orderPopulate);
    } else {
      orders = await Order.find(filter)
        .populate(orderPopulate)
        .sort(sortOptions)
        .skip((pagination.page - 1) * limit)
        .limit(limit);
    }

    return res.status(200).json({
      success: true,
      data: orders,
      pagination,
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
// ADMIN - ORDER STATS
// ===============================

const getAdminOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ isAdmin: false });

    const orderAgg = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          status: 1,
          items: {
            $map: {
              input: "$orderItems",
              as: "item",
              in: {
                quantity: "$$item.quantity",
                price: {
                  $let: {
                    vars: {
                      matchedProduct: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$productDetails",
                              as: "p",
                              cond: { $eq: ["$$p._id", "$$item.product"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$matchedProduct.price", 0] },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          status: 1,
          orderTotal: {
            $sum: {
              $map: {
                input: "$items",
                as: "i",
                in: { $multiply: ["$$i.quantity", "$$i.price"] },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $cond: [{ $ne: ["$status", "Cancelled"] }, "$orderTotal", 0],
            },
          },
          deliveredSales: {
            $sum: {
              $cond: [{ $eq: ["$status", "Delivered"] }, "$orderTotal", 0],
            },
          },
          pendingOrders: {
            $sum: {
              $cond: [{ $in: ["$status", ["Processing", "Confirmed", "Shipped"]] }, 1, 0],
            },
          },
          processingOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Processing"] }, 1, 0],
            },
          },
          confirmedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0],
            },
          },
          shippedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Shipped"] }, 1, 0],
            },
          },
          deliveredOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0],
            },
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0],
            },
          },
          activeOrdersCount: {
            $sum: {
              $cond: [{ $ne: ["$status", "Cancelled"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const result = orderAgg[0] || {};
    const totalSales = result.totalSales || 0;
    const deliveredSales = result.deliveredSales || 0;
    const activeCount = result.activeOrdersCount || 0;
    const avgOrderValue = activeCount > 0 ? Math.round(totalSales / activeCount) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalSales,
        deliveredSales,
        totalCustomers,
        pendingOrders: result.pendingOrders || 0,
        processingOrders: result.processingOrders || 0,
        confirmedOrders: result.confirmedOrders || 0,
        shippedOrders: result.shippedOrders || 0,
        deliveredOrders: result.deliveredOrders || 0,
        cancelledOrders: result.cancelledOrders || 0,
        averageOrderValue: avgOrderValue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
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
  createAdminOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,

  getAllOrders,
  getAdminOrderById,
  updateAdminOrder,
  deleteAdminOrder,
  getAdminOrderStats,
};
