import express from "express";
import { createCheckout, webhookReceiver } from "../Controllers/payment.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach, isAdmin, isTrainee } from "../middlewares/Role.Middleware.js";
const router = express.Router();

// Create checkout link
router.post("/create-checkout", protect, isTrainee, createCheckout);

// Webhook endpoint (Chargily) - ensure express is configured to receive raw body when verifying signature
router.post("/webhook",protect, webhookReceiver);

export default router;
