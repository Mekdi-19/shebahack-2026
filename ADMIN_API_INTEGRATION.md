# Admin API Integration Guide

## Overview
This document describes the integration of backend admin endpoints with the frontend application for managing vendor, product, and service approvals.

## Backend Endpoints

### Base URL
```
http://localhost:5001/api
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### 1. Get All Vendors
- **Endpoint**: `GET /api/admin/vendors`
- **Authentication**: Required (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `status`: Filter by status (`pending`, `approved`, or omit for all)
- **Response**: Array of vendor/user objects
```json
[
  {
    "_id": "vendor_id",
    "name": "Vendor Name",
    "email": "vendor@example.com",
    "role": "vendor",
    "phone": "+251912345678",
    "location": "Addis Ababa",
    "skills": ["Baking", "Catering"],
    "isVerified": false
  }
]
```

#### 2. Get All Products (Admin)
- **Endpoint**: `GET /api/admin/products`
- **Authentication**: Required (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `status`: Filter by status (`pending`, `approved`, or omit for all)
- **Response**: Array of product objects with vendor details
```json
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 850,
    "stock": 10,
    "category": "crafts",
    "images": ["url1", "url2"],
    "isApproved": false,
    "vendor": {
      "_id": "vendor_id",
      "name": "Vendor Name",
      "email": "vendor@example.com"
    }
  }
]
```

#### 3. Get All Services (Admin)
- **Endpoint**: `GET /api/admin/services`
- **Authentication**: Required (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `status`: Filter by status (`pending`, `approved`, or omit for all)
- **Response**: Array of service objects with vendor details

#### 4. Approve Vendor
- **Endpoint**: `PUT /api/admin/vendors/:id/approve`
- **Authentication**: Required (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Updated vendor object with `isVerified: true`

#### 5. Approve Product
- **Endpoint**: `PUT /api/admin/products/:id/approve`
- **Authentication**: Required (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Updated product object with `isApproved: true`

#### 6. Approve Service
- **Endpoint**: `PUT /api/admin/services/:id/approve`
- **Authentication**: Required (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Updated service object with `isApproved: true`

## Frontend Integration

### API Service (`src/services/api.js`)

The API service provides the following admin methods:

```javascript
// Get all vendors with optional status filter
api.getVendors(status) // status: 'pending', 'approved', or null

// Get all products (admin view)
api.getAdminProducts(status) // status: 'pending', 'approved', or null

// Get all services (admin view)
api.getAdminServices(status) // status: 'pending', 'approved', or null

// Approve vendor
api.approveVendor(vendorId)

// Approve product
api.approveProduct(productId)

// Approve service
api.approveService(serviceId)
```

### Admin Approvals Page (`src/pages/AdminApprovals.jsx`)

A dedicated page for managing all approvals with the following features:

#### Features:
1. **Three Tabs**: Vendors, Products, Services
2. **Filter Options**: Pending, Approved, All
3. **Statistics Dashboard**: Shows counts of pending items
4. **Approval Actions**: One-click approval for each item
5. **Detailed Information**: Shows all relevant details for review
6. **Real-time Updates**: Refreshes data after approval

#### Access:
- Route: `/admin/approvals`
- Requires admin authentication
- Accessible from Admin Dashboard via "Approval Management" button

### Admin Dashboard Integration

The main Admin Dashboard (`/admin`) now includes:
- Link to Approval Management page
- Continues to handle venture teams and special offers
- Separated concerns for better organization

## Authentication & Authorization

### Admin Role Check
```javascript
const { user, isAdmin } = useAuth();

// Redirect if not admin
useEffect(() => {
  if (!user) {
    navigate('/login');
  } else if (!isAdmin()) {
    navigate('/');
  }
}, [user, isAdmin, navigate]);
```

### Token Management
All admin API calls automatically include the JWT token:
```javascript
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Usage Examples

### Fetching Pending Vendors
```javascript
import api from '../services/api';

const fetchPendingVendors = async () => {
  try {
    const vendors = await api.getVendors('pending');
    console.log('Pending vendors:', vendors);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Approving a Product
```javascript
const handleApproveProduct = async (productId, productName) => {
  if (!confirm(`Approve product: ${productName}?`)) return;

  try {
    await api.approveProduct(productId);
    alert('Product approved successfully!');
    // Refresh data
    fetchProducts();
  } catch (error) {
    alert('Failed to approve product: ' + error.message);
  }
};
```

## Error Handling

All API calls include comprehensive error handling:

```javascript
try {
  const data = await api.getVendors('pending');
  setVendors(data);
} catch (err) {
  setError('Failed to load vendors: ' + err.message);
  console.error(err);
}
```

## UI States

The AdminApprovals page handles three states:

1. **Loading State**: Shows spinner while fetching data
2. **Error State**: Displays error message with retry option
3. **Empty State**: Shows friendly message when no items found
4. **Data State**: Displays items in appropriate layout

## Testing

### Manual Testing Steps

1. **Login as Admin**
   - Navigate to `/login`
   - Login with admin credentials

2. **Access Approval Management**
   - Go to `/admin` dashboard
   - Click "Approval Management" button
   - Or directly navigate to `/admin/approvals`

3. **Test Vendor Approvals**
   - Click "Vendors" tab
   - Filter by "Pending"
   - Click "Approve Vendor" on any pending vendor
   - Verify vendor is approved

4. **Test Product Approvals**
   - Click "Products" tab
   - Filter by "Pending"
   - Click "Approve" on any pending product
   - Verify product is approved

5. **Test Service Approvals**
   - Click "Services" tab
   - Filter by "Pending"
   - Click "Approve Service" on any pending service
   - Verify service is approved

### Using Postman

1. **Get Admin Token**
   ```
   POST /api/users/login
   Body: { "email": "admin@example.com", "password": "password" }
   ```

2. **Test Get Vendors**
   ```
   GET /api/admin/vendors?status=pending
   Headers: Authorization: Bearer <token>
   ```

3. **Test Approve Vendor**
   ```
   PUT /api/admin/vendors/:id/approve
   Headers: Authorization: Bearer <token>
   ```

## Security Considerations

1. **Role-Based Access**: All endpoints check for admin role
2. **Token Validation**: JWT tokens are validated on every request
3. **Authorization Headers**: Required for all admin operations
4. **Frontend Guards**: Pages redirect non-admins to home

## Future Enhancements

1. **Rejection Functionality**: Add ability to reject with reason
2. **Bulk Approvals**: Approve multiple items at once
3. **Approval History**: Track who approved what and when
4. **Email Notifications**: Notify vendors of approval status
5. **Advanced Filters**: Filter by date, category, vendor, etc.
6. **Search Functionality**: Search within pending items
7. **Pagination**: Handle large numbers of pending items
8. **Audit Logs**: Track all admin actions

## Troubleshooting

### Issue: "Authentication required" error
- **Solution**: Ensure user is logged in and token is stored in localStorage

### Issue: "Admin access required" error
- **Solution**: Verify user has admin role in database

### Issue: Data not loading
- **Solution**: Check backend server is running on correct port (5001)
- **Solution**: Verify API_URL in frontend .env file

### Issue: Approval not working
- **Solution**: Check network tab for API errors
- **Solution**: Verify item ID is correct
- **Solution**: Ensure backend has proper update logic

## Related Documentation

- [Product API Integration](./PRODUCT_API_INTEGRATION.md)
- [API Quick Reference](./API_QUICK_REFERENCE.md)
- [Postman Test Guide](./POSTMAN_TEST_GUIDE.md)
