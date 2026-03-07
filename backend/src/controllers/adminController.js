const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Review = require('../models/Review');
const BulkOrder = require('../models/BulkOrder');
const FinancialContent = require('../models/FinancialContent');

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOrganizations = await User.countDocuments({ role: 'organization' });
    const totalProducts = await Product.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const pendingApprovals = {
      vendors: await User.countDocuments({ role: 'vendor', isVerified: false }),
      products: await Product.countDocuments({ isApproved: false }),
      services: await Service.countDocuments({ isApproved: false })
    };

    res.json({
      users: {
        vendors: totalVendors,
        customers: totalCustomers,
        organizations: totalOrganizations
      },
      products: totalProducts,
      services: totalServices,
      orders: totalOrders,
      revenue: totalRevenue[0]?.total || 0,
      pendingApprovals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const { paginate } = require('../utils/paginationHelper');
    const { role, isVerified, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const result = await paginate(User, filter, {
      page,
      limit,
      select: '-password'
    });

    res.json({
      users: result.data,
      ...result.pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Vendor
exports.approveVendor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, isPhoneVerified: true },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject/Suspend Vendor
exports.suspendVendor = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, suspensionReason: reason },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor suspended', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products (Admin view)
exports.getAllProducts = async (req, res) => {
  try {
    const { paginate } = require('../utils/paginationHelper');
    const { isApproved, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (category) filter.category = category;

    const result = await paginate(Product, filter, {
      page,
      limit,
      populate: { path: 'vendor', select: 'name email phone location' }
    });

    res.json({
      products: result.data,
      ...result.pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Product
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('vendor', 'name email');
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product approved successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Product
exports.rejectProduct = async (req, res) => {
  try {
    const { reason } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isActive: false },
      { new: true }
    );
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // TODO: Send notification to vendor with rejection reason
    res.json({ message: 'Product rejected', product, reason });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Services (Admin view)
exports.getAllServices = async (req, res) => {
  try {
    const { paginate } = require('../utils/paginationHelper');
    const { isApproved, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (category) filter.category = category;

    const result = await paginate(Service, filter, {
      page,
      limit,
      populate: { path: 'provider', select: 'name email phone location' }
    });

    res.json({
      services: result.data,
      ...result.pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Service
exports.approveService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('provider', 'name email');
    
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service approved successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Service
exports.rejectService = async (req, res) => {
  try {
    const { reason } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isActive: false },
      { new: true }
    );
    
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service rejected', service, reason });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const { paginate } = require('../utils/paginationHelper');
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const result = await paginate(Order, filter, {
      page,
      limit,
      populate: [
        { path: 'customer', select: 'name email phone' },
        { path: 'vendor', select: 'name email phone' }
      ]
    });

    res.json({
      orders: result.data,
      ...result.pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { paginate } = require('../utils/paginationHelper');
    const { isApproved, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const result = await paginate(Review, filter, {
      page,
      limit,
      populate: [
        { path: 'customer', select: 'name email' },
        { path: 'vendor', select: 'name email' }
      ]
    });

    res.json({
      reviews: result.data,
      ...result.pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Review
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bulk Orders
exports.getAllBulkOrders = async (req, res) => {
  try {
    const { paginate } = require('../utils/paginationHelper');
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;

    const result = await paginate(BulkOrder, filter, {
      page,
      limit,
      populate: [
        { path: 'organization', select: 'businessName email phone' },
        { path: 'vendor', select: 'name email phone' }
      ]
    });

    res.json({
      bulkOrders: result.data,
      ...result.pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Vendor
exports.rejectVendor = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false, rejectionReason: reason },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'Vendor not found' });
    // TODO: Send notification to vendor with rejection reason
    res.json({ message: 'Vendor rejected', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend User
exports.suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, suspensionReason: reason },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User suspended', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone location')
      .populate('vendor', 'name email phone location');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Revenue Report
exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { paymentStatus: 'completed' };
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const revenue = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      monthlyRevenue: revenue,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor Report
exports.getVendorReport = async (req, res) => {
  try {
    const topVendors = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: '$vendor',
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);

    const populatedVendors = await User.populate(topVendors, {
      path: '_id',
      select: 'name email phone location rating'
    });

    res.json({ topVendors: populatedVendors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Financial Content
exports.createFinancialContent = async (req, res) => {
  try {
    const content = await FinancialContent.create(req.body);
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Financial Content
exports.updateFinancialContent = async (req, res) => {
  try {
    const content = await FinancialContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Financial Content
exports.deleteFinancialContent = async (req, res) => {
  try {
    const content = await FinancialContent.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
