import express from "express";
import { createStore, getStore, updateStore, getMyStore, cancelSubscription } from "../controllers/store.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach } from "../middlewares/Role.Middleware.js";

const router = express.Router();

// Create store (logo + banner)
router.post("/", protect, isCoach, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createStore);

// Get store by coach id (public)
router.get("/:coachId", getStore);

// Get current trainer's store
router.get("/me", protect, isCoach, getMyStore);

// Update store (logo/banner optional)
router.put("/", protect, isCoach, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateStore);

// Cancel subscription (only allowed when subscription ended)
router.post('/cancel-subscription', protect, isCoach, cancelSubscription);

export default router;
