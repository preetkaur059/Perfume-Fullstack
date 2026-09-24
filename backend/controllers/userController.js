import mongoose from "mongoose";
import User from "../models/user.js";
import Order from "../models/order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createPagination, getPagination } from "../utils/pagination.js";


// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const filter = {};

    if (req.query.search?.trim()) {
      const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
      filter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
    }

    if (req.query.role?.trim() && req.query.role.trim().toLowerCase() !== "all") {
      const r = req.query.role.trim().toLowerCase();
      if (r === "admin") {
        filter.isAdmin = true;
      } else if (r === "customer" || r === "user") {
        filter.isAdmin = false;
      }
    }

    let sortQuery = { _id: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "oldest":
          sortQuery = { _id: 1 };
          break;
        case "name_asc":
          sortQuery = { fullName: 1 };
          break;
        case "name_desc":
          sortQuery = { fullName: -1 };
          break;
        case "newest":
        default:
          sortQuery = { _id: -1 };
          break;
      }
    }

    const total = await User.countDocuments(filter);
    const pagination = createPagination({ page, limit, total });
    const users = await User.find(filter)
      .select("-password")
      .sort(sortQuery)
      .skip((pagination.page - 1) * limit)
      .limit(limit);

    // Aggregate order counts for returned users
    const userIds = users.map((u) => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);

    const orderCountMap = {};
    orderCounts.forEach((item) => {
      orderCountMap[item._id.toString()] = item.count;
    });

    let usersWithDetails = users.map((u) => {
      const userObj = u.toObject();
      userObj.orderCount = orderCountMap[u._id.toString()] || 0;
      return userObj;
    });

    if (req.query.sort === "most_orders") {
      usersWithDetails = usersWithDetails.sort(
        (a, b) => (b.orderCount || 0) - (a.orderCount || 0)
      );
    }

    const adminCount = await User.countDocuments({ isAdmin: true });
    const customerCount = await User.countDocuments({ isAdmin: false });

    return res.status(200).json({
      success: true,
      data: usersWithDetails,
      pagination,
      summary: {
        adminCount,
        customerCount,
        totalUsers: total,
      },
    });

  } catch (error) {
    console.log("Get users error:", error);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
//comments
// GET USER STATS
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ isAdmin: true });
    const customerCount = await User.countDocuments({ isAdmin: false });

    // Users created in the last 30 days based on ObjectId timestamp
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const timestampHex = Math.floor(thirtyDaysAgo.getTime() / 1000)
      .toString(16)
      .padEnd(24, "0");
    const minObjectId = new mongoose.Types.ObjectId(timestampHex);

    const newUsersCount = await User.countDocuments({
      _id: { $gte: minObjectId },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        customerCount,
        adminCount,
        newUsersCount,
      },
    });
  } catch (error) {
    console.log("Get user stats error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch user statistics",
      error: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion if current admin is logged in
    if (req.user?.userId && req.user.userId.toString() === id.toString()) {
      return res.status(400).json({
        success: false,
        msg: "You cannot delete your own admin account.",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete user error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to delete user",
      error: error.message,
    });
  }
};


const isProduction = process.env.NODE_ENV === "production";

// Cookies stay HTTP-only, so browser JavaScript can never read either JWT.
const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const createAccessToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email, tokenType: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { userId: user._id, tokenType: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );


// PUBLIC USER
const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  isAdmin: user.isAdmin,
});


// REGISTER
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "All fields are mandatory",
      });
    }

    const doesExist = await User.findOne({ email });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });

  } catch (error) {
    console.log("Register error:", error);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    res.cookie("accessToken", createAccessToken(user), accessTokenCookieOptions);
    res.cookie("refreshToken", createRefreshToken(user), refreshTokenCookieOptions);

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      user: publicUser(user),
    });

  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


// REFRESH ACCESS TOKEN
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, msg: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.tokenType !== "refresh") {
      return res.status(401).json({ success: false, msg: "Invalid refresh token" });
    }

    // Do not issue a fresh access token for an account that was deleted.
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.clearCookie("accessToken", accessTokenCookieOptions);
      res.clearCookie("refreshToken", refreshTokenCookieOptions);
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    res.cookie("accessToken", createAccessToken(user), accessTokenCookieOptions);

    return res.status(200).json({ success: true, msg: "Access token refreshed" });
  } catch (error) {
    res.clearCookie("accessToken", accessTokenCookieOptions);
    res.clearCookie("refreshToken", refreshTokenCookieOptions);
    return res.status(401).json({ success: false, msg: "Invalid or expired refresh token" });
  }
};


// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      res.clearCookie("accessToken", accessTokenCookieOptions);
      res.clearCookie("refreshToken", refreshTokenCookieOptions);

      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      user: publicUser(user),
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorized",
    });
  }
};


// LOGOUT
const logoutUser = (req, res) => {
  res.clearCookie("accessToken", accessTokenCookieOptions);
  res.clearCookie("refreshToken", refreshTokenCookieOptions);

  return res.status(200).json({
    success: true,
    msg: "Logged out successfully",
  });
};


// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, isAdmin } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        msg: "Full name and email are required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Check if email is already used by another user
    const emailExists = await User.findOne({
      email,
      _id: { $ne: id },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    user.fullName = fullName;
    user.email = email;
    if (typeof isAdmin === "boolean") {
      user.isAdmin = isAdmin;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "User updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.log("Update user error:", error);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


export {
  getUsers,
  getUserStats,
  deleteUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
  updateUser,
};
