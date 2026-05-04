import express from "express";
import { getCoachDashboardStats, getAthleteDashboardStats } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach, isAthlete } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Get dashboard stats for coach/trainer
router.get("/coach", protect, isCoach, getCoachDashboardStats);
router.get("/trainer", protect, isCoach, getCoachDashboardStats);

// Get dashboard stats for athlete
router.get("/athlete", protect, isAthlete, getAthleteDashboardStats);

export default router;
