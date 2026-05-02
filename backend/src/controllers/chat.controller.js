import Conversation from "../Models/Conversation.Model.js";
import User from "../Models/User.Model.js";

// @desc    Get or create a conversation between two users
// @route   POST /api/chat/conversation
// @access  Private
export const getOrCreateConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required" });
    }

    if (recipientId === userId) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    // Check if conversation already exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    }).populate("participants", "name email avatar role");

    if (!conversation) {
      // Verify recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: "User not found" });
      }

      conversation = new Conversation({
        participants: [userId, recipientId],
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
    res.status(500).json({ message: "Failed to get conversation", error: error.message });
  }
};

// @desc    Get all conversations for the current user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email avatar role")
      .sort({ updatedAt: -1 });

    res.status(200).json({ conversations });
  } catch (error) {
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
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Verify user is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const message = {
      sender: userId,
      text: text.trim(),
    };

    conversation.messages.push(message);
    conversation.lastMessage = {
      text: text.trim(),
      sender: userId,
      createdAt: new Date(),
    };

    await conversation.save();

    // Return the newly added message
    const newMessage = conversation.messages[conversation.messages.length - 1];

    res.status(201).json({ message: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversation/:conversationId/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

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
      if (msg.sender._id.toString() !== userId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });
    if (updated) await conversation.save();

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};
