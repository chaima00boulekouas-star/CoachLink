import express from "express";
import {
  bookSession,
  getCoachSessions,
  getTraineeSessions,
  updateSessionStatus,
} from "../Controllers/session.controller.js";

const router = express.Router();

// Book a session (trainee)
router.post("/", bookSession);

// Get sessions for coach
router.get("/coach", getCoachSessions);

// Get sessions for trainee
router.get("/trainee", getTraineeSessions);

// Update session status
router.put("/:id", updateSessionStatus);

export default router;
