import express from "express";
import {
  getOrCreateConversation,
  getConversations,
  sendMessage,
  getMessages,
  cleanupDuplicates,
} from "../controllers/chat.controller.js";
import { protect } from "../middlewares/Auth.Middleware.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Get all conversations for the current user
router.get("/conversations", getConversations);

// Get or create a conversation with a specific user
router.post("/conversation", getOrCreateConversation);

// Cleanup duplicate conversations
router.delete("/cleanup-duplicates", cleanupDuplicates);

// Send a message to a conversation
router.post("/conversation/:conversationId/message", sendMessage);

// Get messages for a conversation
router.get("/conversation/:conversationId/messages", getMessages);

export default router;
