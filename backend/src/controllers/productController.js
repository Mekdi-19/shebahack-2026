const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    console.log('Creating product for user:', req.user);
    const product = await Product.create({ ...req.body, vendor: req.user._id || req.user.id });
    const populatedProduct = await Product.findById(product._id).populate('vendor', 'name email phone');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
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
    const userId = req.user._id || req.user.id;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: userId },
      req.body,
      { new: true }
    ).populate('vendor', 'name email phone');
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: userId });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
