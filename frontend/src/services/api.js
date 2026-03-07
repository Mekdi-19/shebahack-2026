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
  
  // Get all services
  getServices: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      
      const url = `${API_BASE_URL}/services${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  // Get service by ID
  getServiceById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Create service (authenticated - vendor only)
  createService: async (serviceData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update service (authenticated - vendor only)
  updateService: async (id, serviceData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service (authenticated - vendor only)
  deleteService: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
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
  
  // Create order (authenticated)
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

  // Get my orders (authenticated)
  getMyOrders: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  },

  // Get order by ID (authenticated)
  getOrderById: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status (authenticated)
  updateOrderStatus: async (id, status) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
  
  // ==================== BOOKINGS ====================
  
  createBooking: async (bookingData) => {
    // Mock implementation - will be updated when booking endpoint is ready
    return { success: true, bookingId: '456' };
  },

  // ==================== REVIEWS ====================

  // Create review (authenticated)
  createReview: async (reviewData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Get vendor reviews
  getVendorReviews: async (vendorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/vendor/${vendorId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching vendor reviews:', error);
      throw error;
    }
  },

  // ==================== FINANCIAL CONTENT ====================

  // Get all financial content
  getFinancialContent: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.contentType) queryParams.append('contentType', filters.contentType);
      
      const url = `${API_BASE_URL}/financial-content${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching financial content:', error);
      throw error;
    }
  },

  // Get financial content by ID
  getFinancialContentById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-content/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching financial content:', error);
      throw error;
    }
  },

  // Create financial content (authenticated - admin only)
  createFinancialContent: async (contentData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/financial-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contentData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating financial content:', error);
      throw error;
    }
  },

  // ==================== BULK ORDERS ====================

  // Create bulk order (authenticated)
  createBulkOrder: async (bulkOrderData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/bulk-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bulkOrderData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating bulk order:', error);
      throw error;
    }
  },

  // Get all bulk orders (authenticated)
  getBulkOrders: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/bulk-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching bulk orders:', error);
      throw error;
    }
  },

  // Update bulk order (authenticated)
  updateBulkOrder: async (id, bulkOrderData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/bulk-orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bulkOrderData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating bulk order:', error);
      throw error;
    }
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
  },

  // ==================== VENDOR GROUPS ====================
  
  // Get all vendor groups
  getVendorGroups: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.location) queryParams.append('location', filters.location);
      
      const url = `${API_BASE_URL}/vendor-groups${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching vendor groups:', error);
      throw error;
    }
  },

  // Get my vendor groups (authenticated)
  getMyVendorGroups: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/vendor-groups/my-groups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching my vendor groups:', error);
      throw error;
    }
  },

  // Get vendor group members
  getVendorGroupMembers: async (groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendor-groups/${groupId}/members`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  },

  // Join vendor group (authenticated vendor)
  joinVendorGroup: async (groupId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/vendor-groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error joining vendor group:', error);
      throw error;
    }
  },

  // Leave vendor group (authenticated vendor)
  leaveVendorGroup: async (groupId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/vendor-groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error leaving vendor group:', error);
      throw error;
    }
  },

  // Create vendor group (admin only)
  createVendorGroup: async (groupData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_BASE_URL}/vendor-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating vendor group:', error);
      throw error;
    }
  }
};

export default api;
