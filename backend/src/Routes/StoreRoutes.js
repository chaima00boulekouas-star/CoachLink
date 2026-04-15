import express from "express";
import { createStore, getStore, updateStore } from "../Controllers/store.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Create store (logo + banner)
router.post("/", upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createStore);

// Get store by coach id
router.get("/:coachId", getStore);

// Update store (logo/banner optional)
router.put("/", upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateStore);

export default router;
