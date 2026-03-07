const Product = require('../models/Product');
const notificationService = require('../services/notificationService');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({ 
      ...req.body, 
      vendor: req.user.id
    });
    
    // Notify subscribers about new product (async, don't wait)
    notificationService.notifyNewProduct(product).catch(err => 
      console.error('Notification error:', err)
    );
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, location, minPrice, maxPrice, isApproved } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameAmharic: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const products = await Product.find(filter)
      .populate('vendor', 'name phone location rating totalReviews skills')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name phone location rating totalReviews skills portfolio bio');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Rate Product
exports.rateProduct = async (req, res) => {
  try {
    const ProductRating = require('../models/ProductRating');
    const { verifyPurchase, updateAverageRating } = require('../utils/ratingHelper');
    
    const { rating, comment, commentAmharic, orderId, images } = req.body;
    const productId = req.params.id;
    const customerId = req.user.id;

    // Verify purchase
    const hasPurchased = await verifyPurchase(orderId, customerId, productId, 'product');
    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'You can only rate products you have purchased and received' 
      });
    }

    // Check if already rated
    const existingRating = await ProductRating.findOne({
      product: productId,
      customer: customerId,
      order: orderId
    });

    if (existingRating) {
      return res.status(400).json({ 
        message: 'You have already rated this product for this order' 
      });
    }

    // Create rating
    const productRating = await ProductRating.create({
      product: productId,
      customer: customerId,
      order: orderId,
      rating,
      comment,
      commentAmharic,
      images: images || []
    });

    // Update average rating
    await updateAverageRating(ProductRating, Product, productId, 'product');

    const populatedRating = await ProductRating.findById(productRating._id)
      .populate('customer', 'name')
      .populate('product', 'name nameAmharic');

    res.status(201).json({
      message: 'Product rated successfully',
      rating: populatedRating
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this product' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get Product Ratings
exports.getProductRatings = async (req, res) => {
  try {
    const ProductRating = require('../models/ProductRating');
    const { paginate } = require('../utils/paginationHelper');
    const { getRatingDistribution } = require('../utils/ratingHelper');
    const { page = 1, limit = 10, rating: ratingFilter } = req.query;
    const productId = req.params.id;

    const filter = { product: productId, isApproved: true };
    if (ratingFilter) filter.rating = Number(ratingFilter);

    const result = await paginate(ProductRating, filter, {
      page,
      limit,
      populate: 'customer',
      select: 'name'
    });

    const distribution = await getRatingDistribution(ProductRating, productId, 'product');

    res.json({
      ratings: result.data,
      ...result.pagination,
      distribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
