import express from "express";
import {
  createSession,
  getCoachSessions,
  getTraineeSessions,
  updateSessionStatus,
  getAcceptedAthletes,
} from "../controllers/session.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";

const router = express.Router();

// Trainer creates a session
router.post("/", protect, createSession);

// Trainer gets their sessions
router.get("/trainer", protect, getCoachSessions);

// Athlete gets their sessions
router.get("/athlete", protect, getTraineeSessions);

// Get accepted athletes for scheduling dropdown (trainer)
router.get("/accepted-athletes", protect, getAcceptedAthletes);

// Update session status
router.put("/:id/status", protect, updateSessionStatus);

export default router;
