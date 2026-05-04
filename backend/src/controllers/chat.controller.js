import Conversation from "../Models/Conversation.Model.js";
import User from "../Models/User.Model.js";
import { createNotification } from "./notification.controller.js";

// @desc    Get or create a conversation between two users
// @route   POST /api/chat/conversation
// @access  Private
export const getOrCreateConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user._id.toString();

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required" });
    }

    if (recipientId === userId) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for existing conversation — use sorted participant IDs to prevent duplicates
    const sortedIds = [userId, recipientId].sort();

    let conversation = await Conversation.findOne({
      participants: { $all: sortedIds, $size: 2 },
    }).populate("participants", "name email avatar role");

    if (!conversation) {
      conversation = new Conversation({
        participants: sortedIds,
        messages: [],
      });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name email avatar role"
      );
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.error("getOrCreateConversation error:", error);
    res.status(500).json({ message: "Failed to get conversation", error: error.message });
  }
};

// @desc    Get all conversations for the current user (deduplicated)
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email avatar role")
      .sort({ updatedAt: -1 });

    // Deduplicate: for each pair of participants, keep only the most recent conversation
    const seen = new Map();
    const unique = [];

    for (const conv of conversations) {
      const ids = conv.participants
        .map(p => p._id.toString())
        .sort()
        .join('-');

      if (!seen.has(ids)) {
        seen.set(ids, true);
        
        // Count unread messages for this user
        const unreadCount = conv.messages.filter(
          m => m.sender.toString() !== userId && !m.read
        ).length;

        const convObj = conv.toObject();
        convObj.unreadCount = unreadCount;
        unique.push(convObj);
      }
    }

    res.status(200).json({ conversations: unique });
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations", error: error.message });
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/chat/conversation/:conversationId/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const userId = req.user._id.toString();

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const message = {
      sender: req.user._id,
      text: text.trim(),
      read: false,
    };

    conversation.messages.push(message);
    conversation.lastMessage = {
      text: text.trim(),
      sender: req.user._id,
      createdAt: new Date(),
    };

    await conversation.save();

    // Return the newly added message with sender populated
    const savedConv = await Conversation.findById(conversationId)
      .populate("messages.sender", "name avatar role");

    const newMessage = savedConv.messages[savedConv.messages.length - 1];

    // Notify the recipient
    const recipientId = conversation.participants.find(p => p.toString() !== userId);
    if (recipientId) {
      createNotification({
        recipient: recipientId,
        type: 'message',
        title: 'New Message',
        message: `${newMessage.sender.name || 'Someone'} sent you a message`,
        relatedId: conversationId,
        relatedModel: 'Conversation'
      }).catch(err => console.error("Failed to create message notification:", err));
    }

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversation/:conversationId/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId)
      .populate("messages.sender", "name avatar role");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not a participant" });
    }

    // Mark unread messages from the other person as read
    let updated = false;
    conversation.messages.forEach((msg) => {
      const senderId = msg.sender?._id?.toString() || msg.sender?.toString();
      if (senderId !== userId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });
    if (updated) await conversation.save();

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

// @desc    Delete duplicate conversations (cleanup utility)
// @route   DELETE /api/chat/cleanup-duplicates
// @access  Private
export const cleanupDuplicates = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const conversations = await Conversation.find({
      participants: req.user._id,
    }).sort({ updatedAt: -1 });

    const seen = new Map();
    let deletedCount = 0;

    for (const conv of conversations) {
      const key = conv.participants
        .map(p => p.toString())
        .sort()
        .join('-');

      if (seen.has(key)) {
        // This is a duplicate — merge messages into the first one, then delete
        const keepId = seen.get(key);
        const keepConv = await Conversation.findById(keepId);

        if (keepConv && conv.messages.length > 0) {
          // Add messages from duplicate that don't already exist
          for (const msg of conv.messages) {
            keepConv.messages.push(msg);
          }
          // Update lastMessage to the most recent
          const allMessages = keepConv.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          if (allMessages.length > 0) {
            const last = allMessages[allMessages.length - 1];
            keepConv.lastMessage = {
              text: last.text,
              sender: last.sender,
              createdAt: last.createdAt,
            };
          }
          await keepConv.save();
        }

        await Conversation.findByIdAndDelete(conv._id);
        deletedCount++;
      } else {
        seen.set(key, conv._id);
      }
    }

    res.json({ message: `Cleaned up ${deletedCount} duplicate conversations` });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ message: "Failed to cleanup", error: error.message });
  }
};
