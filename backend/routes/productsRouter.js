import express from "express";
import Product from "../models/product.js";
import { createProduct, updateProduct, deleteProduct, getAllProducts} from "../controllers/productController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});


router.post("/", isLoggedIn, isAdmin, createProduct);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.get("/all", getAllProducts);

export default router;
