# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running locally
- Git (optional)

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd shebahack-2026/backend

# Install dependencies (already done)
npm install

# Start the backend server
npm start
```

Backend will run on: `http://localhost:5001`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd shebahack-2026/frontend

# Install dependencies (already done)
npm install

# Start the frontend development server
npm run dev
```

Frontend will run on: `http://localhost:5173` (or next available port)

### 3. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## Test the Integration

### Test Product Endpoints

1. **Browse Products**
   - Go to `/marketplace`
   - Should load products from backend
   - Try filtering by category
   - Try searching

2. **View Product Details**
   - Click on any product
   - Should show full product information
   - Try adding to cart

3. **Vendor Product Management** (requires vendor login)
   - Login as a vendor
   - Go to `/vendor-products`
   - Try creating a new product
   - Try editing a product
   - Try deleting a product

### Test Admin Endpoints

1. **Login as Admin**
   - Go to `/login`
   - Login with admin credentials
   - Navigate to `/admin`

2. **Access Approval Management**
   - Click "Approval Management" button
   - Or go directly to `/admin/approvals`

3. **Test Approvals**
   - Click "Vendors" tab → Approve pending vendors
   - Click "Products" tab → Approve pending products
   - Click "Services" tab → Approve pending services
   - Try different filters (Pending/Approved/All)

## Create Test Data

### Create Admin User (via MongoDB)

```javascript
// In MongoDB shell or Compass
use empower-her

db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  role: "admin",
  isVerified: true,
  createdAt: new Date()
})
```

### Create Vendor User

```javascript
db.users.insertOne({
  name: "Test Vendor",
  email: "vendor@test.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  role: "vendor",
  isVerified: false, // Pending approval
  skills: ["Crafts", "Handmade"],
  location: "Addis Ababa",
  createdAt: new Date()
})
```

### Create Test Product

```javascript
db.products.insertOne({
  name: "Test Product",
  description: "This is a test product",
  price: 500,
  stock: 10,
  category: "crafts",
  images: ["https://via.placeholder.com/300x200"],
  isApproved: false, // Pending approval
  vendor: ObjectId("vendor_id_here"),
  createdAt: new Date()
})
```

## API Endpoints Reference

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Admin
- `GET /api/admin/vendors?status=pending` - Get vendors
- `GET /api/admin/products?status=pending` - Get products
- `GET /api/admin/services?status=pending` - Get services
- `PUT /api/admin/vendors/:id/approve` - Approve vendor
- `PUT /api/admin/products/:id/approve` - Approve product
- `PUT /api/admin/services/:id/approve` - Approve service

### Auth
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (auth required)

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in backend directory
- Check port 5001 is not in use

### Frontend won't start
- Check if dependencies are installed
- Verify `.env` file exists in frontend directory
- Try deleting `node_modules` and reinstalling

### API calls failing
- Check backend is running on port 5001
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for errors
- Check backend terminal for errors

### Authentication issues
- Clear localStorage: `localStorage.clear()`
- Login again
- Check token is being sent in headers

### CORS errors
- Verify backend has `cors()` middleware enabled
- Check API URL matches backend URL

## Next Steps

1. Review the integration documentation:
   - `PRODUCT_API_INTEGRATION.md`
   - `ADMIN_API_INTEGRATION.md`
   - `INTEGRATION_SUMMARY.md`

2. Test all endpoints using Postman:
   - Import endpoints from `POSTMAN_TEST_GUIDE.md`

3. Implement additional features:
   - Service management
   - Order tracking
   - Review system
   - User profiles

## Support

For detailed documentation, see:
- Product Integration: `PRODUCT_API_INTEGRATION.md`
- Admin Integration: `ADMIN_API_INTEGRATION.md`
- Complete Summary: `INTEGRATION_SUMMARY.md`
- API Reference: `API_QUICK_REFERENCE.md`
