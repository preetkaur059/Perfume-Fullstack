import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.accessToken;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user data in request
    req.user = decoded;

    // Continue to next middleware/controller
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isLoggedIn;