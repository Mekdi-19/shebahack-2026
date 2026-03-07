const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { validateVendorPost } = require('../middleware/vendorValidation');

router.post('/', authenticate, validateVendorPost('product'), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

// Rating endpoints
router.post('/:id/rate', authenticate, productController.rateProduct);
router.get('/:id/ratings', productController.getProductRatings);

module.exports = router;
