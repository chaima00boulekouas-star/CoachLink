import express from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllRead, 
  deleteNotification,
  getUnreadCount
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/mark-all-read", protect, markAllRead);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
