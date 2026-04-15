// routes/coach.routes.js

import express from "express";
import {
  manageCoachProfile,
  getCoachProfile,
} from "../Controllers/coachProfile.controller.js";

const router = express.Router();

// public
router.get("/:id", getCoachProfile);

// protected (coach only)
// Create or update coach profile
router.post("/", manageCoachProfile);
router.put("/", manageCoachProfile);

// (Optional) delete - left as placeholder
router.delete("/", (req, res) => res.status(501).json({ message: "Not implemented" }));

export default router;