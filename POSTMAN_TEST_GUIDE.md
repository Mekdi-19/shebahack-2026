# Empower-Her API - Postman Test Guide

## Base URL
```
http://localhost:5000
```

---

## 1. USER ENDPOINTS

### 1.1 Register User
**Method:** POST  
**URL:** `http://localhost:5000/api/users/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "buyer"
}
```
**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "buyer"
  }
}
```
**Note:** Save the token for authenticated requests!

---

### 1.2 Register Seller
**Method:** POST  
**URL:** `http://localhost:5000/api/users/register`  
**Body (raw JSON):**
```json
{
  "name": "Sarah Smith",
  "email": "sarah@example.com",
  "password": "password123",
  "role": "seller"
}
```
**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Sarah Smith",
    "email": "sarah@example.com",
    "role": "seller"
  }
}
```

---

### 1.3 Login User
**Method:** POST  
**URL:** `http://localhost:5000/api/users/login`  
**Body (raw JSON):**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "buyer"
  }
}
```

---

### 1.4 Get User Profile (Authenticated)
**Method:** GET  
**URL:** `http://localhost:5000/api/users/profile`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "buyer",
  "isVerified": false,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:30:00.000Z"
}
```

---

### 1.5 Update User Profile (Authenticated)
**Method:** PUT  
**URL:** `http://localhost:5000/api/users/profile`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "name": "Jane Updated",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Jane Updated",
  "email": "jane@example.com",
  "role": "buyer",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "isVerified": false,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T11:00:00.000Z"
}
```

---

## 2. PRODUCT ENDPOINTS

### 2.1 Create Product (Authenticated - Seller)
**Method:** POST  
**URL:** `http://localhost:5000/api/products`  
**Headers:**
```
Authorization: Bearer SELLER_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "name": "Handmade Jewelry Set",
  "description": "Beautiful handcrafted jewelry set with earrings and necklace",
  "price": 49.99,
  "category": "Jewelry",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "stock": 10
}
```
**Expected Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Jewelry Set",
  "description": "Beautiful handcrafted jewelry set with earrings and necklace",
  "price": 49.99,
  "category": "Jewelry",
  "seller": "65f1a2b3c4d5e6f7g8h9i0j2",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "stock": 10,
  "isActive": true,
  "createdAt": "2024-03-15T11:00:00.000Z",
  "updatedAt": "2024-03-15T11:00:00.000Z"
}
```

---

### 2.2 Get All Products
**Method:** GET  
**URL:** `http://localhost:5001/api/products`  
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Handmade Jewelry Set",
    "description": "Beautiful handcrafted jewelry set with earrings and necklace",
    "price": 49.99,
    "category": "Jewelry",
    "seller": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Sarah Smith",
      "email": "sarah@example.com"
    },
    "images": ["https://example.com/image1.jpg"],
    "stock": 10,
    "isActive": true,
    "createdAt": "2024-03-15T11:00:00.000Z",
    "updatedAt": "2024-03-15T11:00:00.000Z"
  }
]
```

---

### 2.3 Get Products by Category
**Method:** GET  
**URL:** `http://localhost:5000/api/products?category=Jewelry`  
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Handmade Jewelry Set",
    "category": "Jewelry",
    "price": 49.99,
    ...
  }
]
```

---

### 2.4 Search Products
**Method:** GET  
**URL:** `http://localhost:5000/api/products?search=jewelry`  
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Handmade Jewelry Set",
    ...
  }
]
```

---

### 2.5 Get Product by ID
**Method:** GET  
**URL:** `http://localhost:5000/api/products/65f1a2b3c4d5e6f7g8h9i0j3`  
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Jewelry Set",
  "description": "Beautiful handcrafted jewelry set with earrings and necklace",
  "price": 49.99,
  "category": "Jewelry",
  "seller": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Sarah Smith",
    "email": "sarah@example.com"
  },
  "images": ["https://example.com/image1.jpg"],
  "stock": 10,
  "isActive": true,
  "createdAt": "2024-03-15T11:00:00.000Z",
  "updatedAt": "2024-03-15T11:00:00.000Z"
}
```

---

### 2.6 Update Product (Authenticated - Owner)
**Method:** PUT  
**URL:** `http://localhost:5000/api/products/65f1a2b3c4d5e6f7g8h9i0j3`  
**Headers:**
```
Authorization: Bearer SELLER_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "price": 39.99,
  "stock": 15
}
```
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Jewelry Set",
  "price": 39.99,
  "stock": 15,
  ...
}
```

---

### 2.7 Delete Product (Authenticated - Owner)
**Method:** DELETE  
**URL:** `http://localhost:5000/api/products/65f1a2b3c4d5e6f7g8h9i0j3`  
**Headers:**
```
Authorization: Bearer SELLER_TOKEN_HERE
```
**Expected Response (200):**
```json
{
  "message": "Product deleted"
}
```

---

## 3. SERVICE ENDPOINTS

### 3.1 Create Service (Authenticated - Seller)
**Method:** POST  
**URL:** `http://localhost:5000/api/services`  
**Headers:**
```
Authorization: Bearer SELLER_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "name": "Business Consulting",
  "description": "Professional business consulting for women entrepreneurs",
  "price": 150,
  "category": "Consulting",
  "duration": "1 hour",
  "availability": ["Monday 9-5", "Wednesday 9-5", "Friday 9-5"]
}
```
**Expected Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
  "name": "Business Consulting",
  "description": "Professional business consulting for women entrepreneurs",
  "price": 150,
  "category": "Consulting",
  "provider": "65f1a2b3c4d5e6f7g8h9i0j2",
  "duration": "1 hour",
  "availability": ["Monday 9-5", "Wednesday 9-5", "Friday 9-5"],
  "isActive": true,
  "createdAt": "2024-03-15T11:30:00.000Z",
  "updatedAt": "2024-03-15T11:30:00.000Z"
}
```

---

### 3.2 Get All Services
**Method:** GET  
**URL:** `http://localhost:5000/api/services`  
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Business Consulting",
    "description": "Professional business consulting for women entrepreneurs",
    "price": 150,
    "category": "Consulting",
    "provider": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Sarah Smith",
      "email": "sarah@example.com"
    },
    "duration": "1 hour",
    "availability": ["Monday 9-5", "Wednesday 9-5", "Friday 9-5"],
    "isActive": true,
    "createdAt": "2024-03-15T11:30:00.000Z",
    "updatedAt": "2024-03-15T11:30:00.000Z"
  }
]
```

---

### 3.3 Get Services by Category
**Method:** GET  
**URL:** `http://localhost:5000/api/services?category=Consulting`  
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Business Consulting",
    "category": "Consulting",
    ...
  }
]
```

---

### 3.4 Search Services
**Method:** GET  
**URL:** `http://localhost:5000/api/services?search=business`  
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Business Consulting",
    ...
  }
]
```

---

### 3.5 Get Service by ID
**Method:** GET  
**URL:** `http://localhost:5000/api/services/65f1a2b3c4d5e6f7g8h9i0j4`  
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
  "name": "Business Consulting",
  "description": "Professional business consulting for women entrepreneurs",
  "price": 150,
  "category": "Consulting",
  "provider": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Sarah Smith",
    "email": "sarah@example.com"
  },
  "duration": "1 hour",
  "availability": ["Monday 9-5", "Wednesday 9-5", "Friday 9-5"],
  "isActive": true,
  "createdAt": "2024-03-15T11:30:00.000Z",
  "updatedAt": "2024-03-15T11:30:00.000Z"
}
```

---

### 3.6 Update Service (Authenticated - Owner)
**Method:** PUT  
**URL:** `http://localhost:5000/api/services/65f1a2b3c4d5e6f7g8h9i0j4`  
**Headers:**
```
Authorization: Bearer SELLER_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "price": 175,
  "availability": ["Monday 9-5", "Tuesday 9-5", "Wednesday 9-5", "Friday 9-5"]
}
```
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
  "name": "Business Consulting",
  "price": 175,
  "availability": ["Monday 9-5", "Tuesday 9-5", "Wednesday 9-5", "Friday 9-5"],
  ...
}
```

---

### 3.7 Delete Service (Authenticated - Owner)
**Method:** DELETE  
**URL:** `http://localhost:5000/api/services/65f1a2b3c4d5e6f7g8h9i0j4`  
**Headers:**
```
Authorization: Bearer SELLER_TOKEN_HERE
```
**Expected Response (200):**
```json
{
  "message": "Service deleted"
}
```

---

## 4. ORDER ENDPOINTS

### 4.1 Create Order (Authenticated)
**Method:** POST  
**URL:** `http://localhost:5000/api/orders`  
**Headers:**
```
Authorization: Bearer BUYER_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "items": [
    {
      "itemType": "product",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j3",
      "quantity": 2,
      "price": 49.99
    },
    {
      "itemType": "service",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j4",
      "quantity": 1,
      "price": 150
    }
  ],
  "totalAmount": 249.98,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```
**Expected Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
  "buyer": "65f1a2b3c4d5e6f7g8h9i0j1",
  "items": [
    {
      "itemType": "product",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j3",
      "quantity": 2,
      "price": 49.99,
      "_id": "65f1a2b3c4d5e6f7g8h9i0j6"
    },
    {
      "itemType": "service",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j4",
      "quantity": 1,
      "price": 150,
      "_id": "65f1a2b3c4d5e6f7g8h9i0j7"
    }
  ],
  "totalAmount": 249.98,
  "status": "pending",
  "paymentStatus": "pending",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "createdAt": "2024-03-15T12:00:00.000Z",
  "updatedAt": "2024-03-15T12:00:00.000Z"
}
```

---

### 4.2 Get My Orders (Authenticated)
**Method:** GET  
**URL:** `http://localhost:5000/api/orders/my-orders`  
**Headers:**
```
Authorization: Bearer BUYER_TOKEN_HERE
```
**Expected Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "buyer": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "items": [
      {
        "itemType": "product",
        "itemId": "65f1a2b3c4d5e6f7g8h9i0j3",
        "quantity": 2,
        "price": 49.99,
        "_id": "65f1a2b3c4d5e6f7g8h9i0j6"
      }
    ],
    "totalAmount": 249.98,
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "createdAt": "2024-03-15T12:00:00.000Z",
    "updatedAt": "2024-03-15T12:00:00.000Z"
  }
]
```

---

### 4.3 Get Order by ID (Authenticated)
**Method:** GET  
**URL:** `http://localhost:5000/api/orders/65f1a2b3c4d5e6f7g8h9i0j5`  
**Headers:**
```
Authorization: Bearer BUYER_TOKEN_HERE
```
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
  "buyer": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "items": [
    {
      "itemType": "product",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j3",
      "quantity": 2,
      "price": 49.99,
      "_id": "65f1a2b3c4d5e6f7g8h9i0j6"
    }
  ],
  "totalAmount": 249.98,
  "status": "pending",
  "paymentStatus": "pending",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "createdAt": "2024-03-15T12:00:00.000Z",
  "updatedAt": "2024-03-15T12:00:00.000Z"
}
```

---

### 4.4 Update Order Status (Authenticated)
**Method:** PUT  
**URL:** `http://localhost:5000/api/orders/65f1a2b3c4d5e6f7g8h9i0j5/status`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "status": "confirmed"
}
```
**Expected Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
  "buyer": "65f1a2b3c4d5e6f7g8h9i0j1",
  "items": [...],
  "totalAmount": 249.98,
  "status": "confirmed",
  "paymentStatus": "pending",
  "shippingAddress": {...},
  "createdAt": "2024-03-15T12:00:00.000Z",
  "updatedAt": "2024-03-15T12:15:00.000Z"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

---

## 5. HEALTH CHECK

### 5.1 Health Check
**Method:** GET  
**URL:** `http://localhost:5000/health`  
**Expected Response (200):**
```json
{
  "status": "ok",
  "message": "Empower-Her API is running"
}
```

---

## TESTING WORKFLOW

### Step-by-Step Testing Order:

1. **Health Check** - Verify server is running
2. **Register Buyer** - Create a buyer account, save token
3. **Register Seller** - Create a seller account, save token
4. **Login** - Test login with both accounts
5. **Get Profile** - Test with buyer token
6. **Update Profile** - Test with buyer token
7. **Create Product** - Use seller token
8. **Get All Products** - No auth needed
9. **Get Product by ID** - Use the ID from created product
10. **Create Service** - Use seller token
11. **Get All Services** - No auth needed
12. **Create Order** - Use buyer token with product/service IDs
13. **Get My Orders** - Use buyer token
14. **Update Order Status** - Use buyer token
15. **Update Product** - Use seller token
16. **Delete Product** - Use seller token

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "message": "User already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message details"
}
```

---

## TIPS FOR POSTMAN

1. **Create Environment Variables:**
   - `base_url`: http://localhost:5000
   - `buyer_token`: (save after registration/login)
   - `seller_token`: (save after registration/login)
   - `product_id`: (save after creating product)
   - `service_id`: (save after creating service)
   - `order_id`: (save after creating order)

2. **Use Collections:** Organize requests by resource (Users, Products, Services, Orders)

3. **Save Tokens Automatically:** In Tests tab of register/login requests:
   ```javascript
   pm.environment.set("buyer_token", pm.response.json().token);
   ```

4. **Use Variables in Requests:**
   - URL: `{{base_url}}/api/products`
   - Authorization: `Bearer {{buyer_token}}`

---

## NOTES

- Make sure MongoDB is running before testing
- All authenticated endpoints require `Authorization: Bearer TOKEN` header
- Product/Service IDs in the examples are placeholders - use actual IDs from your responses
- Sellers can only update/delete their own products and services
- Buyers can view all products/services but need authentication to create orders
