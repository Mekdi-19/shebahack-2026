const User = require('../models/User');

// No validation - vendors can post freely
const validatePost = async (req, res, next) => {
  try {
    const vendor = await User.findById(req.user.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// No validation - vendors can post freely
exports.validateVendorPost = (postType) => {
  return async (req, res, next) => {
    try {
      const vendor = await User.findById(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      req.vendor = vendor;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

exports.validatePost = validatePost;
