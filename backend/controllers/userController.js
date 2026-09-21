import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createPagination, getPagination } from "../utils/pagination.js";


// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query);
    const total = await User.countDocuments();
    const pagination = createPagination({ page, limit, total });
    const users = await User.find()
      .select("-password")
      .sort({ _id: -1 })
      .skip((pagination.page - 1) * limit)
      .limit(limit);
    const adminCount = await User.countDocuments({ isAdmin: true });

    return res.status(200).json({
      success: true,
      data: users,
      pagination,
      summary: {
        adminCount,
        customerCount: total - adminCount,
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
    user.isAdmin = isAdmin;

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
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
  updateUser,
};
