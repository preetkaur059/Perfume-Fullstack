import express from "express";
import {
  getUsers,
  getUserStats,
  deleteUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
  updateUser,
} from "../controllers/userController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { sendSignupOTP, verifySignupOTP } from "../controllers/otpController.js";

const router = express.Router();

router.get("/stats", getUserStats);
router.get("/all", getUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", isLoggedIn, getCurrentUser);
router.post("/logout", logoutUser);

router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/send-signup-otp", sendSignupOTP);

router.post("/verify-signup-otp", verifySignupOTP);

export default router;
