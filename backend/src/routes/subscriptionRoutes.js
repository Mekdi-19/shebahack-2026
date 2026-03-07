const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

// Subscription management
router.post('/', authenticate, subscriptionController.subscribe);
router.get('/me', authenticate, subscriptionController.getMySubscription);
router.put('/preferences', authenticate, subscriptionController.updatePreferences);
router.put('/notifications', authenticate, subscriptionController.updateNotificationSettings);
router.post('/unsubscribe', authenticate, subscriptionController.unsubscribe);

// Recommendations
router.get('/recommendations', authenticate, subscriptionController.getRecommendations);
router.get('/trending', subscriptionController.getTrending);
router.get('/best-value', subscriptionController.getBestValue);

module.exports = router;
