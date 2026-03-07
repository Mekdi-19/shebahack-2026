const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

// Unified endpoint to create product or service
exports.createPost = async (req, res) => {
  try {
    const { postType, ...postData } = req.body;

    // Validate postType
    if (!postType) {
      return res.status(400).json({
        message: 'Please specify what you want to post',
        hint: 'Add "postType" field with value "product" or "service"'
      });
    }

    if (!['product', 'service'].includes(postType)) {
      return res.status(400).json({
        message: 'Invalid post type',
        hint: 'postType must be either "product" or "service"'
      });
    }

    // Create product or service
    if (postType === 'product') {
      const { name, description, price, category } = postData;
      
      if (!name || !description || !price || !category) {
        return res.status(400).json({
          message: 'Missing required product fields',
          required: ['name', 'description', 'price', 'category']
        });
      }

      const result = await Product.create({
        ...postData,
        vendor: req.user.id
      });

      return res.status(201).json({
        message: 'Product created successfully',
        postType: 'product',
        data: result
      });
    }

    if (postType === 'service') {
      const { name, description, price, category } = postData;
      
      if (!name || !description || !price || !category) {
        return res.status(400).json({
          message: 'Missing required service fields',
          required: ['name', 'description', 'price', 'category']
        });
      }

      const result = await Service.create({
        ...postData,
        provider: req.user.id
      });

      return res.status(201).json({
        message: 'Service created successfully',
        postType: 'service',
        data: result
      });
    }

  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating post',
      error: error.message 
    });
  }
};
