import express from "express";
import { createReview, getCoachReviews } from "../controllers/Review.Controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isTrainee } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Create a review for a coach (trainee only)
router.post("/coach/:coachId", protect, isTrainee, createReview);

// Get all reviews for a coach (public)
router.get("/coach/:coachId", getCoachReviews);

export default router;
