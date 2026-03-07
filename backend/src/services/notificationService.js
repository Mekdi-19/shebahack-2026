const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

class NotificationService {
  
  // Send notification to user
  async sendNotification(userId, notificationData) {
    try {
      const user = await User.findById(userId);
      if (!user) return null;
      
      const subscription = await Subscription.findOne({ user: userId, isActive: true });
      
      // Create notification
      const notification = await Notification.create({
        user: userId,
        ...notificationData,
        isSent: true,
        sentAt: new Date()
      });
      
      // Send via enabled channels
      if (subscription?.contactMethod.email && user.email) {
        await this.sendEmail(user.email, notificationData);
        notification.channels.email = true;
      }
      
      if (subscription?.contactMethod.sms && user.phone) {
        await this.sendSMS(user.phone, notificationData);
        notification.channels.sms = true;
      }
      
      if (subscription?.contactMethod.push) {
        await this.sendPushNotification(userId, notificationData);
        notification.channels.push = true;
      }
      
      await notification.save();
      return notification;
      
    } catch (error) {
      console.error('Send notification error:', error);
      return null;
    }
  }
  
  // Notify subscribers about new product
  async notifyNewProduct(product) {
    try {
      const subscriptions = await Subscription.find({
        isActive: true,
        'notifications.newProducts': true,
        $or: [
          { 'preferences.categories': product.category },
          { 'preferences.categories': { $size: 0 } }
        ]
      }).populate('user');
      
      const notifications = [];
      
      for (const sub of subscriptions) {
        // Check price range
        if (sub.preferences.priceRange) {
          if (product.price < sub.preferences.priceRange.min || 
              product.price > sub.preferences.priceRange.max) {
            continue;
          }
        }
        
        const notification = await this.sendNotification(sub.user._id, {
          type: 'new_product',
          title: `New Product: ${product.name}`,
          titleAmharic: `አዲስ ምርት: ${product.nameAmharic || product.name}`,
          message: `${product.name} is now available for ${product.price} Birr`,
          messageAmharic: `${product.nameAmharic || product.name} አሁን በ${product.price} ብር ይገኛል`,
          product: product._id,
          data: {
            newPrice: product.price,
            category: product.category
          }
        });
        
        if (notification) notifications.push(notification);
      }
      
      return notifications;
      
    } catch (error) {
      console.error('Notify new product error:', error);
      return [];
    }
  }
  
  // Notify subscribers about new service
  async notifyNewService(service) {
    try {
      const subscriptions = await Subscription.find({
        isActive: true,
        'notifications.newProducts': true,
        $or: [
          { 'preferences.categories': service.category },
          { 'preferences.categories': { $size: 0 } }
        ]
      }).populate('user');
      
      const notifications = [];
      
      for (const sub of subscriptions) {
        if (sub.preferences.priceRange) {
          if (service.price < sub.preferences.priceRange.min || 
              service.price > sub.preferences.priceRange.max) {
            continue;
          }
        }
        
        const notification = await this.sendNotification(sub.user._id, {
          type: 'new_product',
          title: `New Service: ${service.name}`,
          titleAmharic: `አዲስ አገልግሎት: ${service.nameAmharic || service.name}`,
          message: `${service.name} is now available for ${service.price} Birr`,
          messageAmharic: `${service.nameAmharic || service.name} አሁን በ${service.price} ብር ይገኛል`,
          service: service._id,
          data: {
            newPrice: service.price,
            category: service.category
          }
        });
        
        if (notification) notifications.push(notification);
      }
      
      return notifications;
      
    } catch (error) {
      console.error('Notify new service error:', error);
      return [];
    }
  }
  
  // Notify about special offers (top rated items)
  async notifySpecialOffers() {
    try {
      const subscriptions = await Subscription.find({
        isActive: true,
        'notifications.specialOffers': true
      }).populate('user');
      
      // Get top rated items
      const Product = require('../models/Product');
      const topProducts = await Product.find({
        isActive: true,
        isApproved: true,
        rating: { $gte: 4.5 }
      })
        .sort({ rating: -1, totalReviews: -1 })
        .limit(5);
      
      const notifications = [];
      
      for (const sub of subscriptions) {
        for (const product of topProducts) {
          // Check if matches preferences
          if (sub.preferences.categories.length > 0 && 
              !sub.preferences.categories.includes(product.category)) {
            continue;
          }
          
          const notification = await this.sendNotification(sub.user._id, {
            type: 'special_offer',
            title: `Top Rated: ${product.name}`,
            titleAmharic: `ከፍተኛ ደረጃ: ${product.nameAmharic || product.name}`,
            message: `${product.name} has ${product.rating}⭐ rating with ${product.totalReviews} reviews`,
            messageAmharic: `${product.nameAmharic || product.name} ${product.rating}⭐ ደረጃ ከ${product.totalReviews} ግምገማዎች አለው`,
            product: product._id,
            data: {
              rating: product.rating,
              category: product.category
            }
          });
          
          if (notification) notifications.push(notification);
        }
      }
      
      return notifications;
      
    } catch (error) {
      console.error('Notify special offers error:', error);
      return [];
    }
  }
  
  // Send email (placeholder - integrate with email service)
  async sendEmail(email, data) {
    console.log(`📧 Email to ${email}: ${data.title}`);
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    return true;
  }
  
  // Send SMS (placeholder - integrate with SMS service)
  async sendSMS(phone, data) {
    console.log(`📱 SMS to ${phone}: ${data.message}`);
    // TODO: Integrate with SMS service (Twilio, Africa's Talking, etc.)
    return true;
  }
  
  // Send push notification (placeholder)
  async sendPushNotification(userId, data) {
    console.log(`🔔 Push to ${userId}: ${data.title}`);
    // TODO: Integrate with push service (Firebase, OneSignal, etc.)
    return true;
  }
}

module.exports = new NotificationService();
