import express from "express";
import { createStore, getStore, updateStore } from "../Controllers/store.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isCoach } from "../middlewares/Role.Middleware.js";

const router = express.Router();

// Create store (logo + banner)
router.post("/", protect, isCoach, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createStore);

// Get store by coach id
router.get("/:coachId", protect, isCoach, getStore);

// Update store (logo/banner optional)
router.put("/", protect, isCoach, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateStore);

export default router;
