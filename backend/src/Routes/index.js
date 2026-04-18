// routes/index.js

import express from "express";
import coachRoutes from "./CoachRoutes.js";
import storeRoutes from "./StoreRoutes.js";
import productRoutes from "./ProductRoutes.js";
import orderRoutes from "./OrderRoutes.js";
import sessionRoutes from "./SessionRoutes.js";
import reviewRoutes from "./ReviewRoutes.js";
import paymentRoutes from "./PaymentRoutes.js";
import dashboardRoutes from "./DashboardRoutes.js";
import userRoutes from "./UserRoutes.js";

const router = express.Router();

router.use("/api/coach-profiles", coachRoutes);
router.use("/api/stores", storeRoutes);
router.use("/api/products", productRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/reviews", reviewRoutes);
router.use("/api/payments", paymentRoutes);
router.use("/api/dashboard", dashboardRoutes);
router.use("/api/users", userRoutes);

export default router;