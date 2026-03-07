const Service = require('../models/Service');
const notificationService = require('../services/notificationService');

exports.createService = async (req, res) => {
  try {
    const service = await Service.create({ 
      ...req.body, 
      provider: req.user.id
    });
    
    // Notify subscribers about new service (async, don't wait)
    notificationService.notifyNewService(service).catch(err => 
      console.error('Notification error:', err)
    );
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServices = async (req, res) => {
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
    if (location) filter['location.city'] = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const services = await Service.find(filter)
      .populate('provider', 'name phone location rating totalReviews skills')
      .sort({ createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.id },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, provider: req.user.id });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Rate Service
exports.rateService = async (req, res) => {
  try {
    const ServiceRating = require('../models/ServiceRating');
    const { verifyPurchase, updateAverageRating } = require('../utils/ratingHelper');
    
    const { rating, comment, commentAmharic, orderId, images } = req.body;
    const serviceId = req.params.id;
    const customerId = req.user.id;

    // Verify purchase
    const hasPurchased = await verifyPurchase(orderId, customerId, serviceId, 'service');
    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'You can only rate services you have purchased and received' 
      });
    }

    // Check if already rated
    const existingRating = await ServiceRating.findOne({
      service: serviceId,
      customer: customerId,
      order: orderId
    });

    if (existingRating) {
      return res.status(400).json({ 
        message: 'You have already rated this service for this order' 
      });
    }

    // Create rating
    const serviceRating = await ServiceRating.create({
      service: serviceId,
      customer: customerId,
      order: orderId,
      rating,
      comment,
      commentAmharic,
      images: images || []
    });

    // Update average rating
    await updateAverageRating(ServiceRating, Service, serviceId, 'service');

    const populatedRating = await ServiceRating.findById(serviceRating._id)
      .populate('customer', 'name')
      .populate('service', 'name nameAmharic');

    res.status(201).json({
      message: 'Service rated successfully',
      rating: populatedRating
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this service' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get Service Ratings
exports.getServiceRatings = async (req, res) => {
  try {
    const ServiceRating = require('../models/ServiceRating');
    const { paginate } = require('../utils/paginationHelper');
    const { getRatingDistribution } = require('../utils/ratingHelper');
    const { page = 1, limit = 10, rating: ratingFilter } = req.query;
    const serviceId = req.params.id;

    const filter = { service: serviceId, isApproved: true };
    if (ratingFilter) filter.rating = Number(ratingFilter);

    const result = await paginate(ServiceRating, filter, {
      page,
      limit,
      populate: 'customer',
      select: 'name'
    });

    const distribution = await getRatingDistribution(ServiceRating, serviceId, 'service');

    res.json({
      ratings: result.data,
      ...result.pagination,
      distribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
