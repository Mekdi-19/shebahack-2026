const Notification = require('../models/Notification');

// Get user's notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const filter = { user: req.user.id };
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    const notifications = await Notification.find(filter)
      .populate('product', 'name nameAmharic price images')
      .populate('service', 'name nameAmharic price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      user: req.user.id, 
      isRead: false 
    });
    
    res.json({
      notifications,
      unreadCount,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({
      message: 'Notification marked as read',
      notification
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({
      message: 'All notifications marked as read'
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({
      message: 'Notification deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });
    
    res.json({ unreadCount: count });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
