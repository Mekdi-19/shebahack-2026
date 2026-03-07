const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const { validatePost } = require('../middleware/vendorValidation');

// Unified endpoint for creating products or services
router.post('/', authenticate, validatePost, postController.createPost);

module.exports = router;
