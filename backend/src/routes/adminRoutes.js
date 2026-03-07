 const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/dashboard/stats', authenticate, requireAdmin, adminController.getDashboardStats);

// User Management
router.get('/users', authenticate, requireAdmin, adminController.getAllUsers);
router.get('/users/:id', authenticate, requireAdmin, adminController.getUserById);
router.put('/users/:id/approve', authenticate, requireAdmin, adminController.approveVendor);
router.put('/users/:id/reject', authenticate, requireAdmin, adminController.rejectVendor);
router.put('/users/:id/suspend', authenticate, requireAdmin, adminController.suspendUser);
router.delete('/users/:id', authenticate, requireAdmin, adminController.deleteUser);

// Product Management
router.get('/products', authenticate, requireAdmin, adminController.getAllProducts);
router.put('/products/:id/approve', authenticate, requireAdmin, adminController.approveProduct);
router.put('/products/:id/reject', authenticate, requireAdmin, adminController.rejectProduct);
router.delete('/products/:id', authenticate, requireAdmin, adminController.deleteProduct);

// Service Management
router.get('/services', authenticate, requireAdmin, adminController.getAllServices);
router.put('/services/:id/approve', authenticate, requireAdmin, adminController.approveService);
router.put('/services/:id/reject', authenticate, requireAdmin, adminController.rejectService);
router.delete('/services/:id', authenticate, requireAdmin, adminController.deleteService);

// Order Management
router.get('/orders', authenticate, requireAdmin, adminController.getAllOrders);
router.get('/orders/:id', authenticate, requireAdmin, adminController.getOrderById);

// Review Management
router.get('/reviews', authenticate, requireAdmin, adminController.getAllReviews);
router.put('/reviews/:id/approve', authenticate, requireAdmin, adminController.approveReview);
router.delete('/reviews/:id', authenticate, requireAdmin, adminController.deleteReview);

// Financial Content Management
router.post('/financial-content', authenticate, requireAdmin, adminController.createFinancialContent);
router.put('/financial-content/:id', authenticate, requireAdmin, adminController.updateFinancialContent);
router.delete('/financial-content/:id', authenticate, requireAdmin, adminController.deleteFinancialContent);

// Reports
router.get('/reports/revenue', authenticate, requireAdmin, adminController.getRevenueReport);
router.get('/reports/vendors', authenticate, requireAdmin, adminController.getVendorReport);

module.exports = router;
