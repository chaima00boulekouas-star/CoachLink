import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Add a new product (expect images)
router.post("/", upload.array("images", 6), addProduct);

// Get all products for a store
router.get("/store/:storeId", getProducts);

// Get single product
router.get("/:id", getProductById);

// Update product (allow new images)
router.put("/:id", upload.array("images", 6), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
