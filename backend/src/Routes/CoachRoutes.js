// routes/coach.routes.js

import express from "express";
import {
  manageCoachProfile,
  getCoachProfile,
} from "../controllers/coachProfile.controller.js";

import { protect  } from "../middlewares/Auth.Middleware.js";
import { isCoach , isAdmin ,  } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// public
router.get("/:id", getCoachProfile);

// protected (coach only)
// Create or update coach profile
router.post("/", protect, isCoach, manageCoachProfile);
router.put("/", protect, isCoach, manageCoachProfile);

// (Optional) delete - left as placeholder
router.delete("/", protect, isAdmin, (req, res) => res.status(501).json({ message: "Not implemented" }));

export default router;