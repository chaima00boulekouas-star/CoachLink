import express from "express";
import { createCheckout, webhookReceiver } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isTrainee } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Create checkout link (trainee only)
router.post("/create-checkout", protect, isTrainee, createCheckout);

// Webhook endpoint (Chargily) - NO auth middleware, verify via provider signature
router.post("/webhook", webhookReceiver);

export default router;
