// routes/order.routes.js

import express from "express";
import {
  createOrder,
  getMyOrders,
  getCoachOrders,
  getOrderById,
  updateOrderStatus
} from "../Controllers/order.controller.js";

import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach, isAdmin , isTrainee} from "../middlewares/Role.Middleware.js";
const router = express.Router();

// create order (user)
router.post("/", protect, isTrainee, createOrder);

// get logged user orders
router.get("/myorders",protect, isTrainee, getMyOrders);

// get coach orders (based on products sold)
router.get("/coach", protect, isCoach, getCoachOrders);

// get single order (user or coach)
router.get("/:id", protect, getOrderById);

// update order status (coach or admin)
router.put("/:id", protect, isCoach, updateOrderStatus);

export default router;