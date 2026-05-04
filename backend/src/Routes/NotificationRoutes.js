<<<<<<< HEAD
import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/Auth.Middleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);
=======
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
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)

export default router;
