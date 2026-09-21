import express from "express";
import { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct} from "../controllers/productController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", getAllProducts);


router.post("/", isLoggedIn, isAdmin, createProduct);

router.patch("/:id", isLoggedIn, isAdmin, updateProduct);

router.delete("/:id", isLoggedIn, isAdmin, deleteProduct);

router.get("/all", getAllProducts);

router.get("/:id", getSingleProduct);

export default router;
