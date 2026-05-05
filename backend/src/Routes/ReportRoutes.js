import express from "express";
import { createReport } from "../controllers/report.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";

const router = express.Router();

router.post("/", protect, createReport);

export default router;
