const express = require('express');
const router = express.Router();
const vendorGroupController = require('../controllers/vendorGroupController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Admin only - create vendor group
router.post('/', authenticate, isAdmin, vendorGroupController.createGroup);

// Public - get all groups
router.get('/', vendorGroupController.getAllGroups);

// Authenticated vendor - get my groups
router.get('/my-groups', authenticate, vendorGroupController.getMyGroups);

// Get group members
router.get('/:id/members', vendorGroupController.getGroupMembers);

// Authenticated vendor - join group
router.post('/:id/join', authenticate, vendorGroupController.joinGroup);

// Authenticated vendor - leave group
router.post('/:id/leave', authenticate, vendorGroupController.leaveGroup);

module.exports = router;
