const VendorGroup = require('../models/VendorGroup');

exports.createGroup = async (req, res) => {
  try {
    // Only admin can create groups
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can create vendor groups' });
    }
    
    const group = await VendorGroup.create({ 
      ...req.body, 
      admin: req.user.id, 
      members: [] 
    });
    
    const populatedGroup = await VendorGroup.findById(group._id)
      .populate('admin', 'name phone email')
      .populate('members', 'name skills location email phone');
    
    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const { category, location } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (location) filter['location.city'] = { $regex: location, $options: 'i' };

    const groups = await VendorGroup.find(filter)
      .populate('admin', 'name phone email')
      .populate('members', 'name skills location email phone');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    // Only vendors can join groups
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can join groups' });
    }
    
    const group = await VendorGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }
    
    group.members.push(req.user.id);
    await group.save();
    
    const populatedGroup = await VendorGroup.findById(group._id)
      .populate('admin', 'name phone email')
      .populate('members', 'name skills location email phone');
    
    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const group = await VendorGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not a member of this group' });
    }
    
    group.members = group.members.filter(memberId => memberId.toString() !== req.user.id.toString());
    await group.save();
    
    const populatedGroup = await VendorGroup.findById(group._id)
      .populate('admin', 'name phone email')
      .populate('members', 'name skills location email phone');
    
    res.json({ message: 'Successfully left the group', group: populatedGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const group = await VendorGroup.findById(req.params.id)
      .populate('members', 'name skills location email phone rating totalReviews');
    
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.json(group.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await VendorGroup.find({ 
      members: req.user.id,
      isActive: true 
    })
      .populate('admin', 'name phone email')
      .populate('members', 'name skills location email phone');
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
