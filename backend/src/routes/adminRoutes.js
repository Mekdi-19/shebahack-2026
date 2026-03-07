const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all vendors (with optional filter for pending approval)
router.get('/vendors', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    // Filter by role vendor
    filter.role = 'vendor';
    
    // Filter by verification status if provided
    if (status === 'pending') {
      filter.isVerified = false;
    } else if (status === 'approved') {
      filter.isVerified = true;
    }
    
    const vendors = await User.find(filter).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (with optional filter for pending approval)
router.get('/products', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    // Filter by approval status if provided
    if (status === 'pending') {
      filter.isApproved = false;
    } else if (status === 'approved') {
      filter.isApproved = true;
    }
    
    const products = await Product.find(filter).populate('vendor', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all services (with optional filter for pending approval)
router.get('/services', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    // Filter by approval status if provided
    if (status === 'pending') {
      filter.isApproved = false;
    } else if (status === 'approved') {
      filter.isApproved = true;
    }
    
    const services = await Service.find(filter).populate('vendor', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve vendor
router.put('/vendors/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve product
router.put('/products/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve service
router.put('/services/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
