import express from "express";
import {
  toggleFavorite,
  getFavorites,
} from "../controllers/athleteProfile.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isAthlete } from "../middlewares/Role.Middleware.js";

const router = express.Router();

// Favorites
router.get("/favorites", protect, isAthlete, getFavorites);
router.post("/favorites/:trainerId", protect, isAthlete, toggleFavorite);

export default router;
