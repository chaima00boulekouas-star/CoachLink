import express from "express";
import { 
  getAdminStats, 
  getAllUsers, 
  updateUserStatus, 
  getReports, 
  updateReportStatus, 
  getFeedback, 
  replyFeedback,
  getAdminProducts,
  verifyTrainer,
  bulkVerifyTrainers,
  toggleSubscription
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";
import { isAdmin } from "../middlewares/Role.Middleware.js";

const router = express.Router();

// All routes are protected and restricted to admin
router.use(protect);
router.use(isAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.get("/reports", getReports);
router.put("/reports/:id", updateReportStatus);
router.get("/feedback", getFeedback);
router.post("/feedback/:id/reply", replyFeedback);
router.get("/products", getAdminProducts);
router.put("/users/:id/verify", verifyTrainer);
router.put("/users/:id/subscription", toggleSubscription);
router.post("/bulk-verify-trainers", bulkVerifyTrainers);

export default router;
