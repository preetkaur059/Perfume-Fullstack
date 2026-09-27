import express from "express";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:productId", updateCartItemQuantity);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;
