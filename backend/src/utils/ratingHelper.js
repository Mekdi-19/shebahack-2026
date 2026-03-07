const Order = require('../models/Order');

// Verify customer can rate (purchased and completed order)
exports.verifyPurchase = async (orderId, customerId, itemId, itemType) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: customerId,
    status: 'completed',
    'items.itemType': itemType,
    'items.itemId': itemId
  });

  return !!order;
};

// Calculate and update average rating
exports.updateAverageRating = async (RatingModel, ItemModel, itemId, itemField) => {
  const allRatings = await RatingModel.find({ [itemField]: itemId, isApproved: true });
  
  if (allRatings.length === 0) return;

  const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
  
  await ItemModel.findByIdAndUpdate(itemId, {
    rating: avgRating.toFixed(1),
    totalReviews: allRatings.length
  });
};

// Get rating distribution
exports.getRatingDistribution = async (RatingModel, itemId, itemField) => {
  const mongoose = require('mongoose');
  
  const distribution = await RatingModel.aggregate([
    { $match: { [itemField]: mongoose.Types.ObjectId(itemId), isApproved: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);

  return distribution.reduce((acc, item) => {
    acc[`${item._id}star`] = item.count;
    return acc;
  }, {});
};
