import express from "express";
import { createReview, getCoachReviews } from "../Controllers/Review.Controller.js";

const router = express.Router();

// Create a review for a coach
router.post("/coach/:coachId", createReview);

// Get all reviews for a coach
router.get("/coach/:coachId", getCoachReviews);

export default router;
