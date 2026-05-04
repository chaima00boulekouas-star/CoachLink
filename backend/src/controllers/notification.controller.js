import Notification from "../Models/Notification.Model.js";

/**
 * Helper: create a notification (used internally by other controllers)
 */
export const createNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

/**
 * @desc    Get all notifications for the current user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar")
      .limit(50);
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

/**
 * @desc    Get count of unread notifications
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false 
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count", error: error.message });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read", error: error.message });
  }
};

/**
 * @desc    Mark all notifications as read for current user
 * @route   PUT /api/notifications/mark-all-read
 * @access  Private
 */
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark all as read", error: error.message });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification", error: error.message });
  }
};
