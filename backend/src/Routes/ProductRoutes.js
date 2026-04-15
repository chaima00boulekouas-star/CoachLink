import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Add a new product (expect images)
router.post("/", protect, isCoach, upload.array("images", 6), addProduct);

// Get all products for a store
router.get("/store/:storeId", getProducts);

// Get single product
router.get("/:id", protect, getProductById);

// Update product (allow new images)
router.put("/:id", upload.array("images", 6), protect, isCoach, updateProduct);

// Delete product
router.delete("/:id", protect, isCoach, deleteProduct);

export default router;
