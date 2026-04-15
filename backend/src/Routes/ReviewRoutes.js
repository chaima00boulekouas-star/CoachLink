import express from "express";
import { createReview, getCoachReviews } from "../Controllers/Review.Controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isTrainee } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Create a review for a coach
router.post("/coach/:coachId", protect, isTrainee, createReview);

// Get all reviews for a coach
router.get("/coach/:coachId", protect, isTrainee, getCoachReviews);

export default router;
