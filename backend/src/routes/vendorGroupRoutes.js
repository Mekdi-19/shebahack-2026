const express = require('express');
const router = express.Router();
const vendorGroupController = require('../controllers/vendorGroupController');
const { authenticate } = require('../middleware/auth');

// Manual group management
router.post('/', authenticate, vendorGroupController.createGroup);
router.get('/', vendorGroupController.getAllGroups);
router.get('/:id', vendorGroupController.getGroupById);
router.post('/:id/join', authenticate, vendorGroupController.joinGroup);

// Auto-grouping endpoints
router.post('/auto/location', authenticate, vendorGroupController.autoGroupByLocation);
router.post('/auto/price', authenticate, vendorGroupController.autoGroupByPrice);
router.post('/auto/category', authenticate, vendorGroupController.autoGroupByCategory);
router.post('/auto/rating', authenticate, vendorGroupController.autoGroupByRating);
router.post('/auto/generate-city', authenticate, vendorGroupController.generateCityGroups);

// Suggestions and stats
router.get('/suggestions/me', authenticate, vendorGroupController.getSuggestedGroups);
router.put('/:id/update-stats', authenticate, vendorGroupController.updateGroupStats);

module.exports = router;
