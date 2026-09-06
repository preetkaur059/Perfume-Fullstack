import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.log("Get users error:", error);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};


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

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie(
      "accessToken",
      token,
      accessTokenCookieOptions
    );

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


// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(userId);

    if (!user) {
      res.clearCookie(
        "accessToken",
        accessTokenCookieOptions
      );

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
    res.clearCookie(
      "accessToken",
      accessTokenCookieOptions
    );

    return res.status(401).json({
      success: false,
      msg: "Unauthorized",
    });
  }
};


// LOGOUT
const logoutUser = (req, res) => {
  res.clearCookie(
    "accessToken",
    accessTokenCookieOptions
  );

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
  getCurrentUser,
  logoutUser,
  updateUser,
};
