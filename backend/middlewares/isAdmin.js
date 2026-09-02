import User from "../models/user.js";

const isAdmin = async (req, res, next) => {
  try {
    // Get user ID from logged-in user
    const user = await User.findById(req.user.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is admin
    if (user.isAdmin !== true) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // User is admin
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default isAdmin;