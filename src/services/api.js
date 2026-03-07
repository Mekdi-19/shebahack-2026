// API service functions
// This file will contain all API calls when backend is ready

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Products
  getProducts: async () => {
    // Mock data for now
    return [];
  },
  
  getProductById: async (id) => {
    // Mock data for now
    return null;
  },
  
  // Services
  getServices: async () => {
    // Mock data for now
    return [];
  },
  
  // Vendors
  getVendors: async () => {
    // Mock data for now
    return [];
  },
  
  getVendorById: async (id) => {
    // Mock data for now
    return null;
  },
  
  // Auth
  login: async (email, password) => {
    // Mock implementation
    return { success: true, token: 'mock-token' };
  },
  
  signup: async (userData) => {
    // Mock implementation
    return { success: true, user: userData };
  },
  
  // Orders
  createOrder: async (orderData) => {
    // Mock implementation
    return { success: true, orderId: '123' };
  },
  
  // Bookings
  createBooking: async (bookingData) => {
    // Mock implementation
    return { success: true, bookingId: '456' };
  }
};

export default api;
