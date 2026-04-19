import express from "express";
import {
  bookSession,
  getCoachSessions,
  getTraineeSessions,
  updateSessionStatus,
} from "../controllers/session.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach, isTrainee } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Book a session (trainee)
router.post("/", protect, isTrainee, bookSession);

// Get sessions for coach
router.get("/coach", protect, isCoach, getCoachSessions);

// Get sessions for trainee
router.get("/trainee", protect, isTrainee, getTraineeSessions);

// Update session status
router.put("/:id", protect, isCoach, updateSessionStatus);

export default router;
