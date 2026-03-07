# Product API Integration Guide

## Overview
This document describes the integration of backend product endpoints with the frontend application.

## Backend Endpoints

### Base URL
```
http://localhost:5000/api
```

### Product Endpoints

#### 1. Get All Products
- **Endpoint**: `GET /api/products`
- **Authentication**: Not required
- **Query Parameters** (optional):
  - `category`: Filter by category
  - `search`: Search by name or description
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
- **Response**: Array of product objects

#### 2. Get Product by ID
- **Endpoint**: `GET /api/products/:id`
- **Authentication**: Not required
- **Response**: Single product object

#### 3. Create Product
- **Endpoint**: `POST /api/products`
- **Authentication**: Required (Vendor only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 850,
  "category": "crafts",
  "stock": 10,
  "images": ["url1", "url2"]
}
```

#### 4. Update Product
- **Endpoint**: `PUT /api/products/:id`
- **Authentication**: Required (Vendor only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as create product

#### 5. Delete Product
- **Endpoint**: `DELETE /api/products/:id`
- **Authentication**: Required (Vendor only)
- **Headers**: `Authorization: Bearer <token>`

## Frontend Integration

### API Service (`src/services/api.js`)

The API service provides the following methods:

```javascript
// Get all products with optional filters
api.getProducts({ category, search, minPrice, maxPrice })

// Get single product
api.getProductById(id)

// Create new product (vendor only)
api.createProduct(productData)

// Update product (vendor only)
api.updateProduct(id, productData)

// Delete product (vendor only)
api.deleteProduct(id)
```

### Pages Using Product API

#### 1. Marketplace (`src/pages/Marketplace.jsx`)
- Fetches all products on mount
- Displays loading and error states
- Filters products by category and search term
- Shows product cards in a grid layout

#### 2. Product Details (`src/pages/ProductDetails.jsx`)
- Fetches single product by ID from URL params
- Displays product information, images, and reviews
- Handles add to cart and order functionality
- Shows loading and error states

#### 3. Vendor Products (`src/pages/VendorProducts.jsx`)
- Vendor-only page for managing products
- Create, read, update, and delete operations
- Form modal for adding/editing products
- Filters to show only vendor's own products

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication

The API service automatically includes the JWT token from localStorage in authenticated requests:

```javascript
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Error Handling

All API calls include try-catch blocks and display user-friendly error messages:

```javascript
try {
  const data = await api.getProducts();
  setProducts(data);
} catch (error) {
  setError('Failed to load products');
  console.error(error);
}
```

## Usage Examples

### Fetching Products in a Component

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

function MyComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Render component...
}
```

### Creating a Product

```javascript
const handleCreateProduct = async (productData) => {
  try {
    const newProduct = await api.createProduct(productData);
    console.log('Product created:', newProduct);
  } catch (error) {
    alert('Failed to create product: ' + error.message);
  }
};
```

## Testing

### Using Postman
1. Import the endpoints from `POSTMAN_TEST_GUIDE.md`
2. Set up environment variables for base URL and token
3. Test each endpoint with sample data

### Manual Testing
1. Start the backend server: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `/marketplace` to see products
4. Login as a vendor and go to `/vendor-products` to manage products

## Next Steps

1. Add image upload functionality
2. Implement product reviews API integration
3. Add pagination for product listings
4. Implement advanced filtering and sorting
5. Add product analytics for vendors
