const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, language, skills, organizationType, businessName, offeringType } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = { name, email, password, role, phone, language };
    
    if (location) userData.location = location;
    
    if (role === 'vendor') {
      if (skills) userData.skills = skills;
      // Vendor can choose offering type during registration or skip (set to 'not_set')
      userData.offeringType = offeringType || 'not_set';
      userData.hasCompletedProfile = offeringType ? true : false;
    }
    
    if (role === 'organization') {
      userData.organizationType = organizationType;
      userData.businessName = businessName;
    }

    const user = await User.create(userData);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        phone: user.phone,
        language: user.language,
        offeringType: user.offeringType,
        hasCompletedProfile: user.hasCompletedProfile
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Set Vendor Offering Type (if skipped during registration)
exports.setOfferingType = async (req, res) => {
  try {
    const { offeringType } = req.body;
    
    if (!['products', 'services', 'both'].includes(offeringType)) {
      return res.status(400).json({ 
        message: 'Invalid offering type. Must be: products, services, or both' 
      });
    }

    const user = await User.findById(req.user.id);
    
    if (user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can set offering type' });
    }

    user.offeringType = offeringType;
    user.hasCompletedProfile = true;
    await user.save();

    res.json({ 
      message: 'Offering type set successfully',
      user: {
        id: user._id,
        name: user.name,
        offeringType: user.offeringType,
        hasCompletedProfile: user.hasCompletedProfile
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
