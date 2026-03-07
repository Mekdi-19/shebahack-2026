const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    console.log('Creating service for user:', req.user);
    const service = await Service.create({ ...req.body, provider: req.user._id || req.user.id });
    const populatedService = await Service.findById(service._id).populate('provider', 'name email phone');
    res.status(201).json(populatedService);
  } catch (error) {
    console.error('Error creating service:', error);
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
    const userId = req.user._id || req.user.id;
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: userId },
      req.body,
      { new: true }
    ).populate('provider', 'name email phone');
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const service = await Service.findOneAndDelete({ _id: req.params.id, provider: userId });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
