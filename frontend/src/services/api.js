// API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const api = {
  // ==================== PRODUCTS ====================
  
  // Get all products
  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      
      const url = `${API_BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },
  
  // Create product (authenticated - vendor only)
  createProduct: async (productData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update product (authenticated - vendor only)
  updateProduct: async (id, productData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  // Delete product (authenticated - vendor only)
  deleteProduct: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
  
  // ==================== SERVICES ====================
  
  getServices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },
  
  // ==================== AUTH ====================
  
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await handleResponse(response);
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await handleResponse(response);
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
  
  // ==================== ORDERS ====================
  
  createOrder: async (orderData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // ==================== BOOKINGS ====================
  
  createBooking: async (bookingData) => {
    // Mock implementation - will be updated when booking endpoint is ready
    return { success: true, bookingId: '456' };
  },

  // ==================== ADMIN ====================
  
  // Get all vendors (admin only)
  getVendors: async (status = null) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const queryParams = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE_URL}/admin/vendors${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  // Get all products for admin (admin only)
  getAdminProducts: async (status = null) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const queryParams = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE_URL}/admin/products${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },

  // Get all services for admin (admin only)
  getAdminServices: async (status = null) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const queryParams = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE_URL}/admin/services${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin services:', error);
      throw error;
    }
  },

  // Approve vendor (admin only)
  approveVendor: async (vendorId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error approving vendor:', error);
      throw error;
    }
  },

  // Approve product (admin only)
  approveProduct: async (productId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error approving product:', error);
      throw error;
    }
  },

  // Approve service (admin only)
  approveService: async (serviceId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error approving service:', error);
      throw error;
    }
  }
};

export default api;
