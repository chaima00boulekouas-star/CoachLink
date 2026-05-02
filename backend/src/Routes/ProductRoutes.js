import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getAllProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Add a new product (expect images)
router.post("/", protect, isCoach, upload.array("images", 6), addProduct);

// Get all products (public)
router.get("/", getAllProducts);

// Get all products for a store (public)
router.get("/store/:storeId", getProducts);

// Get my store products (private)
router.get("/my-store", protect, isCoach, getMyProducts);

// Get single product (public)
router.get("/:id", getProductById);

// Update product (allow new images) - auth BEFORE upload
router.put("/:id", protect, isCoach, upload.array("images", 6), updateProduct);

// Delete product
router.delete("/:id", protect, isCoach, deleteProduct);

export default router;
