const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');
const { validateVendorPost } = require('../middleware/vendorValidation');

router.post('/', authenticate, validateVendorPost('service'), serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', authenticate, serviceController.updateService);
router.delete('/:id', authenticate, serviceController.deleteService);

// Rating endpoints
router.post('/:id/rate', authenticate, serviceController.rateService);
router.get('/:id/ratings', serviceController.getServiceRatings);

module.exports = router;
