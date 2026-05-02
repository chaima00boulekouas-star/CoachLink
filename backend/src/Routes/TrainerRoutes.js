// routes/coach.routes.js

import express from "express";
import {
  manageCoachProfile,
  getCoachProfile,
  toggleFavorite,
  getFavorites,
} from "../controllers/trainerProfile.controller.js";

import { protect  } from "../middlewares/Auth.Middleware.js";
import { isTrainer , isAdmin ,  } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Favorites
router.get("/favorites", protect, isTrainer, getFavorites);
router.post("/favorites/:athleteId", protect, isTrainer, toggleFavorite);

// public
router.get("/:id", getCoachProfile);

// protected (trainer only)
// Create or update coach profile
router.post("/", protect, isTrainer, manageCoachProfile);
router.put("/", protect, isTrainer, manageCoachProfile);

// (Optional) delete - left as placeholder
router.delete("/", protect, isAdmin, (req, res) => res.status(501).json({ message: "Not implemented" }));

export default router;