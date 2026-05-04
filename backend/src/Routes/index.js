import express from "express";
import trainerRoutes from "./TrainerRoutes.js";
import athleteRoutes from "./AthleteRoutes.js";
import storeRoutes from "./StoreRoutes.js";
import productRoutes from "./ProductRoutes.js";
import orderRoutes from "./OrderRoutes.js";
import sessionRoutes from "./SessionRoutes.js";
import reviewRoutes from "./ReviewRoutes.js";
import paymentRoutes from "./PaymentRoutes.js";
import dashboardRoutes from "./DashboardRoutes.js";
import userRoutes from "./UserRoutes.js";
import chatRoutes from "./ChatRoutes.js";
<<<<<<< HEAD
import requestRoutes from "./RequestRoutes.js";
=======
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
import notificationRoutes from "./NotificationRoutes.js";

const router = express.Router();

router.use("/api/trainer-profiles", trainerRoutes);
router.use("/api/coach-profiles", trainerRoutes); // Keep for compatibility
router.use("/api/athlete-profiles", athleteRoutes);
router.use("/api/stores", storeRoutes);
router.use("/api/products", productRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/reviews", reviewRoutes);
router.use("/api/payments", paymentRoutes);
router.use("/api/dashboard", dashboardRoutes);
router.use("/api/users", userRoutes);
router.use("/api/chat", chatRoutes);
<<<<<<< HEAD
router.use("/api/requests", requestRoutes);
=======
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
router.use("/api/notifications", notificationRoutes);

export default router;