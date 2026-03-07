const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');
const groupInvitationController = require('../controllers/groupInvitationController');

// Vendor role middleware
const requireVendor = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'vendor') {
      return res.status(403).json({ message: 'Vendor access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin routes - send invitations
router.post('/send', authenticate, requireAdmin, groupInvitationController.sendInvitation);
router.post('/send-bulk', authenticate, requireAdmin, groupInvitationController.sendBulkInvitations);
router.post('/auto-invite/:groupId', authenticate, requireAdmin, groupInvitationController.autoInviteForGroup);
router.get('/group/:groupId/stats', authenticate, requireAdmin, groupInvitationController.getGroupInvitationStats);

// Vendor routes - manage invitations
router.get('/my-invitations', authenticate, requireVendor, groupInvitationController.getMyInvitations);
router.post('/:invitationId/accept', authenticate, requireVendor, groupInvitationController.acceptInvitation);
router.post('/:invitationId/reject', authenticate, requireVendor, groupInvitationController.rejectInvitation);

module.exports = router;
