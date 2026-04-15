// routes/order.routes.js

import express from "express";
import {
  createOrder,
  getMyOrders,
  getCoachOrders,
  getOrderById,
  updateOrderStatus
} from "../Controllers/order.controller.js";


const router = express.Router();

// create order (user)
router.post("/", createOrder);

// get logged user orders
router.get("/myorders", getMyOrders);

// get coach orders (based on products sold)
router.get("/coach", getCoachOrders);

// get single order (user or coach)
router.get("/:id", getOrderById);

// update order status (coach or admin)
router.put("/:id", updateOrderStatus);

export default router;