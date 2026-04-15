import express from "express";
import { createCheckout, webhookReceiver } from "../Controllers/payment.controller.js";

const router = express.Router();

// Create checkout link
router.post("/create-checkout", createCheckout);

// Webhook endpoint (Chargily) - ensure express is configured to receive raw body when verifying signature
router.post("/webhook", webhookReceiver);

export default router;
