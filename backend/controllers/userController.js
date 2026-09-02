import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUsers = async (req, res) => {
  res.send("ALL USERS!");
};

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
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

    // Check email already exists
    const doesExist = await User.findOne({ email });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
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

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
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

    // Create JWT token
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

    res.cookie("accessToken", token, accessTokenCookieOptions);

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

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    
    if (!user) {
      res.clearCookie("accessToken", accessTokenCookieOptions);
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (error) {
    res.clearCookie("accessToken", accessTokenCookieOptions);
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken", accessTokenCookieOptions);
  return res.status(200).json({ success: true, msg: "Logged out successfully" });
};

export { getUsers, registerUser, loginUser, getCurrentUser, logoutUser };
