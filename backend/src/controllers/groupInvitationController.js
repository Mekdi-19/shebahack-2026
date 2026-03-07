const groupInvitationService = require('../services/groupInvitationService');
const autoGroupingService = require('../services/autoGroupingService');

// Send invitation to vendor (Admin only)
exports.sendInvitation = async (req, res) => {
  try {
    const { groupId, vendorId, matchCriteria } = req.body;
    
    if (!groupId || !vendorId) {
      return res.status(400).json({ 
        message: 'groupId and vendorId are required' 
      });
    }
    
    const result = await groupInvitationService.sendInvitation(
      groupId, 
      vendorId, 
      req.user.id, 
      matchCriteria
    );
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation: result.invitation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send bulk invitations (Admin only)
exports.sendBulkInvitations = async (req, res) => {
  try {
    const { groupId, vendorIds, matchCriteria } = req.body;
    
    if (!groupId || !vendorIds || !Array.isArray(vendorIds)) {
      return res.status(400).json({ 
        message: 'groupId and vendorIds array are required' 
      });
    }
    
    const results = await groupInvitationService.sendBulkInvitations(
      groupId, 
      vendorIds, 
      req.user.id, 
      matchCriteria
    );
    
    res.status(201).json({
      message: 'Bulk invitations processed',
      results: {
        sent: results.sent.length,
        alreadyInvited: results.alreadyInvited.length,
        failed: results.failed.length
      },
      details: results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor's invitations (Vendor dashboard)
exports.getMyInvitations = async (req, res) => {
  try {
    const { status } = req.query;
    
    const invitations = await groupInvitationService.getVendorInvitations(
      req.user.id, 
      status
    );
    
    res.json({
      count: invitations.length,
      invitations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept invitation (Vendor)
exports.acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { message } = req.body;
    
    const result = await groupInvitationService.acceptInvitation(
      invitationId, 
      req.user.id, 
      message
    );
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({
      message: 'Invitation accepted successfully',
      invitation: result.invitation,
      group: result.group
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject invitation (Vendor)
exports.rejectInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { message } = req.body;
    
    const result = await groupInvitationService.rejectInvitation(
      invitationId, 
      req.user.id, 
      message
    );
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({
      message: 'Invitation rejected',
      invitation: result.invitation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invitation statistics for a group (Admin)
exports.getGroupInvitationStats = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const stats = await groupInvitationService.getGroupInvitationStats(groupId);
    
    if (!stats) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-send invitations after creating auto-groups (Admin)
exports.autoInviteForGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const VendorGroup = require('../models/VendorGroup');
    
    const group = await VendorGroup.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Determine match criteria based on group type
    const matchCriteria = {
      location: group.groupType === 'auto_location',
      price: group.groupType === 'auto_price',
      category: group.groupType === 'auto_category',
      rating: group.groupType === 'auto_rating'
    };
    
    // Send invitations to all members
    const results = await groupInvitationService.sendBulkInvitations(
      groupId,
      group.members.map(m => m.toString()),
      req.user.id,
      matchCriteria
    );
    
    res.json({
      message: 'Auto-invitations sent',
      groupName: group.name,
      results: {
        sent: results.sent.length,
        alreadyInvited: results.alreadyInvited.length,
        failed: results.failed.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
