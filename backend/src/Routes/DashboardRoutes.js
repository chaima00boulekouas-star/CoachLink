import express from "express";
import { getCoachDashboardStats } from "../Controllers/dashboard.controller.js";

const router = express.Router();

// Get dashboard stats for coach
router.get("/coach", getCoachDashboardStats);

export default router;
