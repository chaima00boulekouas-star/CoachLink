import express from "express";
import { submitFeedback, getMyFeedback } from "../controllers/feedback.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";

const router = express.Router();

router.use(protect);
router.post("/", submitFeedback);
router.get("/me", getMyFeedback);

export default router;
