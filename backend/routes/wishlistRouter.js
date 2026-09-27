import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
} from "../controllers/wishlistController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.get("/check/:productId", checkInWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
