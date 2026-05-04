<<<<<<< HEAD
import Notification from '../Models/Notification.Model.js';

// Helper: create a notification (used internally by other controllers)
export const createNotification = async ({ recipient, type, title, message, relatedId, relatedModel }) => {
  try {
    return await Notification.create({ recipient, type, title, message, relatedId, relatedModel });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

// @desc    Get all notifications for the current user
=======
import Notification from "../Models/Notification.Model.js";

// @desc    Get all notifications for current user
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
<<<<<<< HEAD
      .limit(50);

    res.json({ notifications });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get unread notification count
=======
      .populate("sender", "name avatar");
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

// @desc    Get count of unread notifications
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
<<<<<<< HEAD
    const count = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Mark a single notification as read
=======
    const count = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false 
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count", error: error.message });
  }
};

// @desc    Mark a notification as read
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
<<<<<<< HEAD
    const notif = await Notification.findOneAndUpdate(
=======
    const notification = await Notification.findOneAndUpdate(
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
<<<<<<< HEAD
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json({ notification: notif });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
=======
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read", error: error.message });
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
  }
};

// @desc    Mark all notifications as read
<<<<<<< HEAD
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
=======
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllRead = async (req, res) => {
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
<<<<<<< HEAD
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
=======
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark all as read", error: error.message });
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
<<<<<<< HEAD
    const notif = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
=======
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

// Helper function to create notification (internal use)
export const createNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error("Error creating notification:", error.message);
>>>>>>> 06b6f4a (Implement real-time message notifications and fix chat alignment identity)
  }
};
