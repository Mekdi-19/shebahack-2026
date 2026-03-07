const Subscription = require('../models/Subscription');
const recommendationService = require('../services/recommendationService');

// Create or update subscription
exports.subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if subscription exists
    let subscription = await Subscription.findOne({ user: userId });
    
    if (subscription) {
      // Update existing subscription
      subscription = await Subscription.findOneAndUpdate(
        { user: userId },
        { ...req.body, isActive: true },
        { new: true }
      );
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        user: userId,
        ...req.body
      });
    }
    
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's subscription
exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    
    res.json(subscription);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subscription preferences
exports.updatePreferences = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { preferences: req.body },
      { new: true }
    );
    
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    
    res.json({
      message: 'Preferences updated successfully',
      subscription
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { notifications: req.body },
      { new: true }
    );
    
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    
    res.json({
      message: 'Notification settings updated successfully',
      subscription
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsubscribe
exports.unsubscribe = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { isActive: false },
      { new: true }
    );
    
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    
    res.json({
      message: 'Unsubscribed successfully',
      subscription
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personalized recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await recommendationService.getRecommendations(req.user.id, limit);
    
    res.json({
      count: recommendations.length,
      recommendations
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending items
exports.getTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const trending = await recommendationService.getTrendingItems(limit);
    
    res.json({
      count: trending.length,
      trending
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get best value items
exports.getBestValue = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const bestValue = await recommendationService.getBestValueItems(limit);
    
    res.json({
      count: bestValue.length,
      bestValue
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
