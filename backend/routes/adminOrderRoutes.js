import express from "express";

import {
  createAdminOrder,
  getAllOrders,
  getAdminOrderById,
  updateAdminOrder,
  deleteAdminOrder,
} from "../controllers/orderController.js";

import isLoggedIn from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(isLoggedIn);
router.use(isAdmin);

router.post("/", createAdminOrder);

router.get("/", getAllOrders);

router.get("/:id", getAdminOrderById);

router.patch("/:id", updateAdminOrder);

router.delete("/:id", deleteAdminOrder);

export default router;
