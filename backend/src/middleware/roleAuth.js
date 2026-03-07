// Role-based authorization middleware

exports.requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: 'Access denied',
          requiredRole: roles,
          yourRole: user.role
        });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

exports.requireAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
