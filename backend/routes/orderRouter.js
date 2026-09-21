import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.use(isLoggedIn);

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.patch("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;