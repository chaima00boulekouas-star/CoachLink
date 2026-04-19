import express from "express";
import { getCoachDashboardStats } from "../controllers/dashboard.controller.js";
 import { protect } from "../middlewares/Auth.Middleware.js";
 import { isCoach } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Get dashboard stats for coach
router.get("/coach", protect, isCoach, getCoachDashboardStats);

export default router;
