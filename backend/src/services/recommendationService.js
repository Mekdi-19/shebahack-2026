const Product = require('../models/Product');
const Service = require('../models/Service');
const Subscription = require('../models/Subscription');

// AI-powered ranking algorithm
class RecommendationEngine {
  
  // Calculate recommendation score based on multiple factors
  calculateScore(item, preferences, type = 'rating') {
    let score = 0;
    
    if (type === 'rating') {
      // Rating-based scoring (0-100)
      score += (item.rating || 0) * 20; // Max 100 points
      score += Math.min(item.totalReviews || 0, 50); // Up to 50 bonus points for reviews
      
      // Recency bonus (newer items get slight boost)
      const daysSinceCreation = (Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation < 7) score += 10; // New items bonus
      
    } else if (type === 'price') {
      // Price-based scoring (lower price = higher score)
      const maxPrice = preferences.priceRange?.max || 10000;
      const priceScore = ((maxPrice - item.price) / maxPrice) * 100;
      score += Math.max(0, priceScore);
      
      // Value for money (rating per price unit)
      if (item.rating && item.price > 0) {
        score += (item.rating / item.price) * 20;
      }
      
    } else if (type === 'both') {
      // Balanced scoring
      score += (item.rating || 0) * 15; // Rating component
      
      const maxPrice = preferences.priceRange?.max || 10000;
      const priceScore = ((maxPrice - item.price) / maxPrice) * 50;
      score += Math.max(0, priceScore); // Price component
      
      // Quality-price ratio
      if (item.rating && item.price > 0) {
        score += (item.rating / item.price) * 15;
      }
    }
    
    // Category match bonus
    if (preferences.categories?.includes(item.category)) {
      score += 20;
    }
    
    // Location match bonus
    const itemLocation = item.vendor?.location?.city || item.provider?.location?.city;
    if (preferences.locations?.includes(itemLocation)) {
      score += 15;
    }
    
    // Approval bonus
    if (item.isApproved) {
      score += 10;
    }
    
    return Math.round(score);
  }
  
  // Get personalized recommendations
  async getRecommendations(userId, limit = 10) {
    try {
      const subscription = await Subscription.findOne({ user: userId, isActive: true });
      
      if (!subscription) {
        return this.getDefaultRecommendations(limit);
      }
      
      const { preferences } = subscription;
      const filter = {
        isActive: true,
        isApproved: true
      };
      
      // Apply price range filter
      if (preferences.priceRange) {
        filter.price = {
          $gte: preferences.priceRange.min || 0,
          $lte: preferences.priceRange.max || 10000
        };
      }
      
      // Apply category filter
      if (preferences.categories?.length > 0) {
        filter.category = { $in: preferences.categories };
      }
      
      // Fetch products and services
      const [products, services] = await Promise.all([
        Product.find(filter)
          .populate('vendor', 'name location rating')
          .limit(limit * 2)
          .lean(),
        Service.find(filter)
          .populate('provider', 'name location rating')
          .limit(limit * 2)
          .lean()
      ]);
      
      // Combine and score items
      const allItems = [
        ...products.map(p => ({ ...p, type: 'product' })),
        ...services.map(s => ({ ...s, type: 'service' }))
      ];
      
      // Calculate scores
      const scoredItems = allItems.map(item => ({
        ...item,
        recommendationScore: this.calculateScore(item, preferences, preferences.rankingType)
      }));
      
      // Sort by score and return top items
      const recommendations = scoredItems
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
      
      return recommendations;
      
    } catch (error) {
      console.error('Recommendation error:', error);
      return this.getDefaultRecommendations(limit);
    }
  }
  
  // Get top rated items (default recommendations)
  async getDefaultRecommendations(limit = 10) {
    try {
      const [products, services] = await Promise.all([
        Product.find({ isActive: true, isApproved: true })
          .sort({ rating: -1, totalReviews: -1 })
          .populate('vendor', 'name location')
          .limit(limit / 2)
          .lean(),
        Service.find({ isActive: true, isApproved: true })
          .sort({ rating: -1, totalReviews: -1 })
          .populate('provider', 'name location')
          .limit(limit / 2)
          .lean()
      ]);
      
      return [
        ...products.map(p => ({ ...p, type: 'product', recommendationScore: p.rating * 20 })),
        ...services.map(s => ({ ...s, type: 'service', recommendationScore: s.rating * 20 }))
      ];
      
    } catch (error) {
      console.error('Default recommendation error:', error);
      return [];
    }
  }
  
  // Get trending items (most viewed/ordered recently)
  async getTrendingItems(limit = 10) {
    try {
      // Get items created in last 30 days with good ratings
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const [products, services] = await Promise.all([
        Product.find({
          isActive: true,
          isApproved: true,
          createdAt: { $gte: thirtyDaysAgo }
        })
          .sort({ rating: -1, totalReviews: -1, createdAt: -1 })
          .populate('vendor', 'name location')
          .limit(limit / 2)
          .lean(),
        Service.find({
          isActive: true,
          isApproved: true,
          createdAt: { $gte: thirtyDaysAgo }
        })
          .sort({ rating: -1, totalReviews: -1, createdAt: -1 })
          .populate('provider', 'name location')
          .limit(limit / 2)
          .lean()
      ]);
      
      return [
        ...products.map(p => ({ ...p, type: 'product' })),
        ...services.map(s => ({ ...s, type: 'service' }))
      ];
      
    } catch (error) {
      console.error('Trending items error:', error);
      return [];
    }
  }
  
  // Get best value items (best rating/price ratio)
  async getBestValueItems(limit = 10) {
    try {
      const [products, services] = await Promise.all([
        Product.find({ isActive: true, isApproved: true, rating: { $gte: 3 } })
          .populate('vendor', 'name location')
          .lean(),
        Service.find({ isActive: true, isApproved: true, rating: { $gte: 3 } })
          .populate('provider', 'name location')
          .lean()
      ]);
      
      const allItems = [
        ...products.map(p => ({ ...p, type: 'product' })),
        ...services.map(s => ({ ...s, type: 'service' }))
      ];
      
      // Calculate value score (rating / price)
      const scoredItems = allItems
        .filter(item => item.price > 0)
        .map(item => ({
          ...item,
          valueScore: (item.rating / item.price) * 100
        }))
        .sort((a, b) => b.valueScore - a.valueScore)
        .slice(0, limit);
      
      return scoredItems;
      
    } catch (error) {
      console.error('Best value items error:', error);
      return [];
    }
  }
}

module.exports = new RecommendationEngine();
