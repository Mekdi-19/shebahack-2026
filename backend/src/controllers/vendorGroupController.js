const VendorGroup = require('../models/VendorGroup');
const autoGroupingService = require('../services/autoGroupingService');
const groupInvitationService = require('../services/groupInvitationService');

// Create manual group
exports.createGroup = async (req, res) => {
  try {
    const group = await VendorGroup.create({ 
      ...req.body, 
      admin: req.user.id, 
      members: [req.user.id],
      groupType: 'manual'
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const { category, location, groupType, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (location) filter['location.city'] = { $regex: location, $options: 'i' };
    if (groupType) filter.groupType = groupType;
    
    if (minPrice || maxPrice) {
      filter['priceRange.min'] = { $lte: maxPrice || 10000 };
      filter['priceRange.max'] = { $gte: minPrice || 0 };
    }

    const groups = await VendorGroup.find(filter)
      .populate('admin', 'name phone')
      .populate('members', 'name skills location rating')
      .sort({ 'stats.totalMembers': -1 });
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await VendorGroup.findById(req.params.id)
      .populate('admin', 'name phone email location')
      .populate('members', 'name skills location rating totalReviews');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join group
exports.joinGroup = async (req, res) => {
  try {
    const group = await VendorGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    group.members.push(req.user.id);
    group.stats.totalMembers = group.members.length;
    await group.save();
    
    // Update group statistics
    await autoGroupingService.updateGroupStats(group._id);
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-group by location
exports.autoGroupByLocation = async (req, res) => {
  try {
    const { city, subcity, category, sendInvitations } = req.body;
    
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    
    const group = await autoGroupingService.groupByLocation(city, subcity, category);
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Not enough vendors found to create a group',
        hint: 'Need at least 2 vendors in the specified location'
      });
    }
    
    // Send invitations if requested
    let invitationResults = null;
    if (sendInvitations !== false) {
      invitationResults = await groupInvitationService.sendBulkInvitations(
        group._id,
        group.members.map(m => m.toString()),
        req.user.id,
        { location: true }
      );
    }
    
    res.status(201).json({
      message: 'Auto-group created successfully',
      group,
      invitations: invitationResults ? {
        sent: invitationResults.sent.length,
        alreadyInvited: invitationResults.alreadyInvited.length,
        failed: invitationResults.failed.length
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-group by price range
exports.autoGroupByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice, category, sendInvitations } = req.body;
    
    if (minPrice === undefined || maxPrice === undefined) {
      return res.status(400).json({ message: 'Price range (minPrice and maxPrice) is required' });
    }
    
    const group = await autoGroupingService.groupByPriceRange(minPrice, maxPrice, category);
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Not enough vendors found in this price range',
        hint: 'Need at least 2 vendors with products/services in the specified price range'
      });
    }
    
    // Send invitations if requested
    let invitationResults = null;
    if (sendInvitations !== false) {
      invitationResults = await groupInvitationService.sendBulkInvitations(
        group._id,
        group.members.map(m => m.toString()),
        req.user.id,
        { price: true }
      );
    }
    
    res.status(201).json({
      message: 'Price-based auto-group created successfully',
      group,
      invitations: invitationResults ? {
        sent: invitationResults.sent.length,
        alreadyInvited: invitationResults.alreadyInvited.length,
        failed: invitationResults.failed.length
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-group by category
exports.autoGroupByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    
    const group = await autoGroupingService.groupByCategory(category);
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Not enough vendors found in this category',
        hint: 'Need at least 2 vendors with products/services in the specified category'
      });
    }
    
    res.status(201).json({
      message: 'Category-based auto-group created successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-group by rating
exports.autoGroupByRating = async (req, res) => {
  try {
    const { minRating, maxRating, category, sendInvitations } = req.body;
    
    if (minRating === undefined) {
      return res.status(400).json({ message: 'minRating is required' });
    }
    
    if (minRating < 0 || minRating > 5) {
      return res.status(400).json({ message: 'minRating must be between 0 and 5' });
    }
    
    const max = maxRating || 5;
    
    if (max < minRating || max > 5) {
      return res.status(400).json({ message: 'maxRating must be between minRating and 5' });
    }
    
    const group = await autoGroupingService.groupByRating(minRating, max, category);
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Not enough vendors found in this rating range',
        hint: 'Need at least 2 vendors with ratings in the specified range'
      });
    }
    
    // Send invitations if requested
    let invitationResults = null;
    if (sendInvitations !== false) {
      invitationResults = await groupInvitationService.sendBulkInvitations(
        group._id,
        group.members.map(m => m.toString()),
        req.user.id,
        { rating: true }
      );
    }
    
    res.status(201).json({
      message: 'Rating-based auto-group created successfully',
      group,
      invitations: invitationResults ? {
        sent: invitationResults.sent.length,
        alreadyInvited: invitationResults.alreadyInvited.length,
        failed: invitationResults.failed.length
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate all auto-groups for a city
exports.generateCityGroups = async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    
    const results = await autoGroupingService.generateCityGroups(city);
    
    if (!results) {
      return res.status(500).json({ message: 'Failed to generate groups' });
    }
    
    res.status(201).json({
      message: `Auto-groups generated for ${city}`,
      results: {
        locationGroups: results.location.length,
        priceGroups: results.price.length,
        categoryGroups: results.category.length,
        ratingGroups: results.rating.length,
        total: results.location.length + results.price.length + results.category.length + results.rating.length
      },
      groups: results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get suggested groups for current vendor
exports.getSuggestedGroups = async (req, res) => {
  try {
    const suggestions = await autoGroupingService.suggestGroupsForVendor(req.user.id);
    
    res.json({
      count: suggestions.length,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update group statistics
exports.updateGroupStats = async (req, res) => {
  try {
    const group = await autoGroupingService.updateGroupStats(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json({
      message: 'Group statistics updated successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
