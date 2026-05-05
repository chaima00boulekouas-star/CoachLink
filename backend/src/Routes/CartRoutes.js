import express from "express";
import { 
  getCart, 
  addItem, 
  updateQuantity, 
  removeItem, 
  clearCart 
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getCart)
  .post(protect, addItem)
  .delete(protect, clearCart);

router.route("/:itemId")
  .put(protect, updateQuantity)
  .delete(protect, removeItem);

export default router;
