# EmpowerHer Market API - Postman Test Guide

## Base URL
```
http://localhost:5001
```

## Overview
This API supports the EmpowerHer Market platform for Ethiopian women to sell products and services.

### Key Features:
- Multi-language support (Amharic, Afaan Oromo, Tigrinya, English)
- Vendor profiles with skills and portfolio
- Product marketplace with bulk pricing
- Service booking system
- Organization bulk orders
- Rating & trust system (Quality, Reliability, Service)
- Financial literacy content
- Vendor community groups
- Payment methods: Telebirr, Bank Transfer, Cash

---

## 1. USER ENDPOINTS

### 1.1 Register Customer
**Method:** POST  
**URL:** `http://localhost:5001/api/users/register`  
**Body:**
```json
{
  "name": "Almaz Tesfaye",
  "email": "almaz@example.com",
  "password": "password123",
  "phone": "+251911234567",
  "role": "customer",
  "language": "amharic",
  "location": {
    "city": "Addis Ababa",
    "subcity": "Bole",
    "woreda": "03"
  }
}
```
**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Almaz Tesfaye",
    "email": "almaz@example.com",
    "role": "customer",
    "phone": "+251911234567",
    "language": "amharic"
  }
}
```

### 1.2 Register Vendor (Woman Seller)
**Method:** POST  
**URL:** `http://localhost:5001/api/users/register`  
**Body:**
```json
{
  "name": "Marta Bekele",
  "email": "marta@example.com",
  "password": "password123",
  "phone": "+251922345678",
  "role": "vendor",
  "language": "amharic",
  "location": {
    "city": "Addis Ababa",
    "subcity": "Kirkos",
    "woreda": "08"
  },
  "skills": ["Laundry", "Babysitting", "Cooking"],
  "paymentMethod": "telebirr",
  "telebirrNumber": "+251922345678"
}
```

### 1.3 Register Organization
**Method:** POST  
**URL:** `http://localhost:5001/api/users/register`  
**Body:**
```json
{
  "name": "Yohannes Haile",
  "email": "yohannes@restaurant.com",
  "password": "password123",
  "phone": "+251933456789",
  "role": "organization",
  "organizationType": "restaurant",
  "businessName": "Habesha Restaurant",
  "location": {
    "city": "Addis Ababa",
    "subcity": "Arada"
  }
}
```

### 1.4 Login
**Method:** POST  
**URL:** `http://localhost:5001/api/users/login`  
**Body:**
```json
{
  "email": "marta@example.com",
  "password": "password123"
}
```

### 1.5 Get Profile (Authenticated)
**Method:** GET  
**URL:** `http://localhost:5001/api/users/profile`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### 1.6 Update Vendor Profile
**Method:** PUT  
**URL:** `http://localhost:5001/api/users/profile`  
**Headers:**
```
Authorization: Bearer VENDOR_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "bio": "Experienced in laundry and childcare services. 5 years experience.",
  "portfolio": ["https://example.com/portfolio1.jpg", "https://example.com/portfolio2.jpg"],
  "skills": ["Laundry", "Babysitting", "Cooking", "Cleaning"]
}
```

---

## 2. PRODUCT ENDPOINTS

### 2.1 Create Product (Vendor)
**Method:** POST  
**URL:** `http://localhost:5001/api/products`  
**Headers:**
```
Authorization: Bearer VENDOR_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Handmade Basket",
  "nameAmharic": "በእጅ የተሰራ ቅርጫት",
  "description": "Beautiful handwoven basket made from natural materials",
  "descriptionAmharic": "ከተፈጥሮ ቁሳቁሶች የተሰራ ቆንጆ የእጅ ሥራ ቅርጫት",
  "price": 250,
  "category": "baskets",
  "stock": 15,
  "minOrderQuantity": 1,
  "images": ["https://example.com/basket1.jpg"],
  "bulkPricing": [
    { "minQuantity": 10, "price": 220 },
    { "minQuantity": 50, "price": 200 }
  ]
}
```
**Expected Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Basket",
  "nameAmharic": "በእጅ የተሰራ ቅርጫት",
  "price": 250,
  "category": "baskets",
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "stock": 15,
  "isApproved": false,
  "isActive": true,
  "rating": 0,
  "totalReviews": 0
}
```

### 2.2 Get All Products
**Method:** GET  
**URL:** `http://localhost:5001/api/products`  
**Query Parameters:**
- `category` - Filter by category (handmade_crafts, food, clothes, jewelry, baskets, textiles)
- `search` - Search in name/nameAmharic
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `isApproved` - Filter approved products (true/false)

**Example:** `http://localhost:5001/api/products?category=baskets&isApproved=true`

### 2.3 Get Product by ID
**Method:** GET  
**URL:** `http://localhost:5001/api/products/{productId}`  
**Expected Response:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Basket",
  "vendor": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Marta Bekele",
    "phone": "+251922345678",
    "location": {
      "city": "Addis Ababa",
      "subcity": "Kirkos"
    },
    "rating": 4.7,
    "totalReviews": 23,
    "skills": ["Laundry", "Babysitting", "Cooking"],
    "bio": "Experienced in laundry and childcare services"
  },
  "price": 250,
  "bulkPricing": [...]
}
```

---

## 3. SERVICE ENDPOINTS

### 3.1 Create Service (Vendor)
**Method:** POST  
**URL:** `http://localhost:5001/api/services`  
**Headers:**
```
Authorization: Bearer VENDOR_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Laundry Service",
  "nameAmharic": "የልብስ ማጠቢያ አገልግሎት",
  "description": "Professional laundry service for clothes and linens",
  "descriptionAmharic": "ለልብሶች እና ለአልጋ ልብሶች ሙያዊ የልብስ ማጠቢያ አገልግሎት",
  "price": 50,
  "category": "laundry",
  "priceType": "per_item",
  "duration": "1 day",
  "location": {
    "city": "Addis Ababa",
    "subcity": "Kirkos"
  },
  "availability": [
    {
      "day": "monday",
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "day": "wednesday",
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "day": "friday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

### 3.2 Get All Services
**Method:** GET  
**URL:** `http://localhost:5001/api/services`  
**Query Parameters:**
- `category` - laundry, daycare, cleaning, cooking, catering, sewing, hairdressing
- `search` - Search in name/nameAmharic
- `location` - Filter by city
- `minPrice` / `maxPrice`
- `isApproved` - true/false

**Example:** `http://localhost:5001/api/services?category=laundry&location=Addis Ababa`

---

## 4. ORDER ENDPOINTS

### 4.1 Create Order (Customer)
**Method:** POST  
**URL:** `http://localhost:5001/api/orders`  
**Headers:**
```
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "orderType": "individual",
  "items": [
    {
      "itemType": "product",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j3",
      "itemName": "Handmade Basket",
      "quantity": 2,
      "price": 250,
      "subtotal": 500
    },
    {
      "itemType": "service",
      "itemId": "65f1a2b3c4d5e6f7g8h9i0j4",
      "itemName": "Laundry Service",
      "quantity": 5,
      "price": 50,
      "subtotal": 250
    }
  ],
  "totalAmount": 750,
  "paymentMethod": "telebirr",
  "deliveryAddress": {
    "city": "Addis Ababa",
    "subcity": "Bole",
    "woreda": "03",
    "specificLocation": "Near Edna Mall",
    "phone": "+251911234567"
  },
  "scheduledDate": "2024-03-20T10:00:00Z",
  "notes": "Please call before delivery"
}
```

### 4.2 Get My Orders
**Method:** GET  
**URL:** `http://localhost:5001/api/orders/my-orders`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### 4.3 Update Order Status
**Method:** PUT  
**URL:** `http://localhost:5001/api/orders/{orderId}/status`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "status": "confirmed"
}
```
**Valid Status:** pending, confirmed, in_progress, completed, cancelled

---

## 5. BULK ORDER ENDPOINTS (Organizations)

### 5.1 Create Bulk Order Request
**Method:** POST  
**URL:** `http://localhost:5001/api/bulk-orders`  
**Headers:**
```
Authorization: Bearer ORGANIZATION_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "items": [
    {
      "itemType": "product",
      "itemName": "Cookies",
      "quantity": 200,
      "requestedPrice": 5
    }
  ],
  "deliverySchedule": {
    "frequency": "weekly",
    "startDate": "2024-03-20",
    "endDate": "2024-06-20"
  },
  "deliveryAddress": {
    "city": "Addis Ababa",
    "subcity": "Arada",
    "specificLocation": "Habesha Restaurant, Piazza",
    "phone": "+251933456789"
  },
  "notes": "Need fresh cookies every Monday morning",
  "paymentTerms": "Monthly payment"
}
```

### 5.2 Get All Bulk Orders
**Method:** GET  
**URL:** `http://localhost:5001/api/bulk-orders`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 6. REVIEW & RATING ENDPOINTS

### 6.1 Create Review
**Method:** POST  
**URL:** `http://localhost:5001/api/reviews`  
**Headers:**
```
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "order": "65f1a2b3c4d5e6f7g8h9i0j5",
  "itemType": "service",
  "itemId": "65f1a2b3c4d5e6f7g8h9i0j4",
  "ratings": {
    "quality": 5,
    "reliability": 5,
    "service": 4
  },
  "comment": "Excellent laundry service! Very professional.",
  "commentAmharic": "በጣም ጥሩ የልብስ ማጠቢያ አገልግሎት! በጣም ሙያዊ።"
}
```
**Expected Response:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
  "customer": "65f1a2b3c4d5e6f7g8h9i0j1",
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "overallRating": 4.67,
  "ratings": {
    "quality": 5,
    "reliability": 5,
    "service": 4
  }
}
```

### 6.2 Get Vendor Reviews
**Method:** GET  
**URL:** `http://localhost:5001/api/reviews/vendor/{vendorId}`

---

## 7. FINANCIAL LITERACY CONTENT

### 7.1 Get All Content
**Method:** GET  
**URL:** `http://localhost:5001/api/financial-content`  
**Query Parameters:**
- `category` - pricing, saving, business_growth, marketing, budgeting
- `contentType` - video, article, tip

**Example:** `http://localhost:5001/api/financial-content?category=pricing&contentType=video`

### 7.2 Get Content by ID
**Method:** GET  
**URL:** `http://localhost:5001/api/financial-content/{contentId}`

### 7.3 Create Content (Admin)
**Method:** POST  
**URL:** `http://localhost:5001/api/financial-content`  
**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "title": "How to Price Your Products",
  "titleAmharic": "ምርቶችዎን እንዴት ዋጋ ማስያዝ እንደሚቻል",
  "description": "Learn the basics of pricing your handmade products",
  "descriptionAmharic": "የእጅ ሥራ ምርቶችዎን ዋጋ የማስያዝ መሰረታዊ ነገሮችን ይማሩ",
  "contentType": "video",
  "category": "pricing",
  "videoUrl": "https://youtube.com/watch?v=example",
  "duration": "10:30"
}
```

---

## 8. VENDOR GROUPS

### 8.1 Create Group
**Method:** POST  
**URL:** `http://localhost:5001/api/vendor-groups`  
**Headers:**
```
Authorization: Bearer VENDOR_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Addis Ababa Craft Makers",
  "nameAmharic": "አዲስ አበባ የእጅ ሥራ ሰሪዎች",
  "description": "Group for women making handmade crafts",
  "descriptionAmharic": "የእጅ ሥራ ለሚሰሩ ሴቶች ቡድን",
  "category": "craft_making",
  "location": {
    "city": "Addis Ababa",
    "subcity": "Kirkos"
  }
}
```

### 8.2 Get All Groups
**Method:** GET  
**URL:** `http://localhost:5001/api/vendor-groups`  
**Query Parameters:**
- `category` - cooking, craft_making, textile_work, services
- `location` - Filter by city

### 8.3 Join Group
**Method:** POST  
**URL:** `http://localhost:5001/api/vendor-groups/{groupId}/join`  
**Headers:**
```
Authorization: Bearer VENDOR_TOKEN
```

---

## 9. ADMIN ENDPOINTS

### 9.1 Approve Vendor
**Method:** PUT  
**URL:** `http://localhost:5001/api/admin/vendors/{vendorId}/approve`  
**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 9.2 Approve Product
**Method:** PUT  
**URL:** `http://localhost:5001/api/admin/products/{productId}/approve`  
**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 9.3 Approve Service
**Method:** PUT  
**URL:** `http://localhost:5001/api/admin/services/{serviceId}/approve`  
**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

---

## TESTING WORKFLOW

1. **Register 3 users:** Customer, Vendor, Organization
2. **Login** as each user and save tokens
3. **Vendor:** Create products and services
4. **Admin:** Approve vendor, products, services
5. **Customer:** Browse products/services
6. **Customer:** Create individual order
7. **Organization:** Create bulk order request
8. **Customer:** Submit review after order
9. **Vendor:** Create/join vendor group
10. **All:** Browse financial literacy content

---

## CATEGORIES REFERENCE

### Product Categories:
- handmade_crafts
- food
- clothes
- jewelry
- baskets
- textiles
- other

### Service Categories:
- laundry
- daycare
- cleaning
- cooking
- catering
- sewing
- hairdressing
- other

### Languages:
- amharic
- afaan_oromo
- tigrinya
- english

### Payment Methods:
- mpesa


---

## ERROR RESPONSES

### 400 Bad Request
```json
{ "message": "User already exists" }
```

### 401 Unauthorized
```json
{ "message": "Invalid token" }
```

### 403 Forbidden
```json
{ "message": "Admin access required" }
```

### 404 Not Found
```json
{ "message": "Product not found" }
```

### 500 Internal Server Error
```json
{ "message": "Error details" }
```
