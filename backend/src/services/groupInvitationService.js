const GroupInvitation = require('../models/GroupInvitation');
const VendorGroup = require('../models/VendorGroup');
const Notification = require('../models/Notification');
const User = require('../models/User');

class GroupInvitationService {
  
  // Send invitation to vendor
  async sendInvitation(groupId, vendorId, invitedBy, matchCriteria = {}) {
    try {
      // Check if invitation already exists
      const existing = await GroupInvitation.findOne({
        group: groupId,
        vendor: vendorId,
        status: { $in: ['pending', 'accepted'] }
      });
      
      if (existing) {
        if (existing.status === 'accepted') {
          return { success: false, message: 'Vendor already in group' };
        }
        return { success: false, message: 'Invitation already sent' };
      }
      
      const [group, vendor] = await Promise.all([
        VendorGroup.findById(groupId),
        User.findById(vendorId)
      ]);
      
      if (!group) {
        return { success: false, message: 'Group not found' };
      }
      
      if (!vendor || vendor.role !== 'vendor') {
        return { success: false, message: 'Vendor not found' };
      }
      
      // Create invitation
      const invitation = await GroupInvitation.create({
        group: groupId,
        vendor: vendorId,
        invitedBy,
        matchCriteria,
        message: `You've been invited to join "${group.name}"`,
        messageAmharic: `ወደ "${group.nameAmharic || group.name}" ቡድን ተጋብዘዋል`
      });
      
      // Create notification for vendor
      await Notification.create({
        user: vendorId,
        type: 'recommendation',
        title: `Group Invitation: ${group.name}`,
        titleAmharic: `የቡድን ግብዣ: ${group.nameAmharic || group.name}`,
        message: `You've been invited to join "${group.name}". Check your invitations to accept or reject.`,
        messageAmharic: `ወደ "${group.nameAmharic || group.name}" ቡድን ተጋብዘዋል። ለመቀበል ወይም ለመቃወም ግብዣዎችዎን ይመልከቱ።`,
        data: {
          invitationId: invitation._id,
          groupId: group._id,
          groupName: group.name
        }
      });
      
      return { success: true, invitation };
      
    } catch (error) {
      console.error('Send invitation error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // Send bulk invitations to multiple vendors
  async sendBulkInvitations(groupId, vendorIds, invitedBy, matchCriteria = {}) {
    try {
      const results = {
        sent: [],
        failed: [],
        alreadyInvited: []
      };
      
      for (const vendorId of vendorIds) {
        const result = await this.sendInvitation(groupId, vendorId, invitedBy, matchCriteria);
        
        if (result.success) {
          results.sent.push(vendorId);
        } else if (result.message.includes('already')) {
          results.alreadyInvited.push(vendorId);
        } else {
          results.failed.push({ vendorId, reason: result.message });
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('Bulk invitation error:', error);
      return { sent: [], failed: [], alreadyInvited: [] };
    }
  }
  
  // Accept invitation
  async acceptInvitation(invitationId, vendorId, responseMessage = null) {
    try {
      const invitation = await GroupInvitation.findOne({
        _id: invitationId,
        vendor: vendorId,
        status: 'pending'
      }).populate('group invitedBy');
      
      if (!invitation) {
        return { success: false, message: 'Invitation not found or already processed' };
      }
      
      // Check if expired
      if (new Date() > invitation.expiresAt) {
        invitation.status = 'expired';
        await invitation.save();
        return { success: false, message: 'Invitation has expired' };
      }
      
      // Update invitation
      invitation.status = 'accepted';
      invitation.response = {
        message: responseMessage || 'Accepted',
        respondedAt: new Date()
      };
      await invitation.save();
      
      // Add vendor to group
      const group = await VendorGroup.findById(invitation.group._id);
      if (!group.members.includes(vendorId)) {
        group.members.push(vendorId);
        group.stats.totalMembers = group.members.length;
        await group.save();
      }
      
      // Notify admin
      await Notification.create({
        user: invitation.invitedBy._id,
        type: 'recommendation',
        title: `Invitation Accepted`,
        titleAmharic: `ግብዣ ተቀባይነት አግኝቷል`,
        message: `Vendor has accepted invitation to join "${invitation.group.name}"`,
        messageAmharic: `ሻጩ ወደ "${invitation.group.nameAmharic || invitation.group.name}" ቡድን የመቀላቀል ግብዣን ተቀብሏል`,
        data: {
          invitationId: invitation._id,
          groupId: invitation.group._id,
          vendorId: vendorId,
          status: 'accepted'
        }
      });
      
      return { success: true, invitation, group };
      
    } catch (error) {
      console.error('Accept invitation error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // Reject invitation
  async rejectInvitation(invitationId, vendorId, responseMessage = null) {
    try {
      const invitation = await GroupInvitation.findOne({
        _id: invitationId,
        vendor: vendorId,
        status: 'pending'
      }).populate('group invitedBy');
      
      if (!invitation) {
        return { success: false, message: 'Invitation not found or already processed' };
      }
      
      // Update invitation
      invitation.status = 'rejected';
      invitation.response = {
        message: responseMessage || 'Rejected',
        respondedAt: new Date()
      };
      await invitation.save();
      
      // Notify admin
      await Notification.create({
        user: invitation.invitedBy._id,
        type: 'recommendation',
        title: `Invitation Rejected`,
        titleAmharic: `ግብዣ ውድቅ ሆኗል`,
        message: `Vendor has rejected invitation to join "${invitation.group.name}"${responseMessage ? `: ${responseMessage}` : ''}`,
        messageAmharic: `ሻጩ ወደ "${invitation.group.nameAmharic || invitation.group.name}" ቡድን የመቀላቀል ግብዣን ውድቅ አድርጓል`,
        data: {
          invitationId: invitation._id,
          groupId: invitation.group._id,
          vendorId: vendorId,
          status: 'rejected',
          reason: responseMessage
        }
      });
      
      return { success: true, invitation };
      
    } catch (error) {
      console.error('Reject invitation error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // Get vendor's pending invitations
  async getVendorInvitations(vendorId, status = 'pending') {
    try {
      const filter = { vendor: vendorId };
      
      if (status) {
        filter.status = status;
      }
      
      const invitations = await GroupInvitation.find(filter)
        .populate('group', 'name nameAmharic description category location priceRange ratingRange stats')
        .populate('invitedBy', 'name email')
        .sort({ createdAt: -1 });
      
      return invitations;
      
    } catch (error) {
      console.error('Get vendor invitations error:', error);
      return [];
    }
  }
  
  // Get group's invitation statistics
  async getGroupInvitationStats(groupId) {
    try {
      const [pending, accepted, rejected, expired] = await Promise.all([
        GroupInvitation.countDocuments({ group: groupId, status: 'pending' }),
        GroupInvitation.countDocuments({ group: groupId, status: 'accepted' }),
        GroupInvitation.countDocuments({ group: groupId, status: 'rejected' }),
        GroupInvitation.countDocuments({ group: groupId, status: 'expired' })
      ]);
      
      return {
        pending,
        accepted,
        rejected,
        expired,
        total: pending + accepted + rejected + expired,
        acceptanceRate: accepted + rejected > 0 
          ? ((accepted / (accepted + rejected)) * 100).toFixed(1) 
          : 0
      };
      
    } catch (error) {
      console.error('Get invitation stats error:', error);
      return null;
    }
  }
  
  // Expire old invitations (run as cron job)
  async expireOldInvitations() {
    try {
      const result = await GroupInvitation.updateMany(
        {
          status: 'pending',
          expiresAt: { $lt: new Date() }
        },
        {
          status: 'expired'
        }
      );
      
      return result.modifiedCount;
      
    } catch (error) {
      console.error('Expire invitations error:', error);
      return 0;
    }
  }
}

module.exports = new GroupInvitationService();
