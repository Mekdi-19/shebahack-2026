# EmpowerHer Market - API Quick Reference

## Base URL: `http://localhost:5001`

## Authentication
Add to headers: `Authorization: Bearer YOUR_TOKEN`

---

## ENDPOINTS SUMMARY

### 👤 USERS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | No | Register new user |
| POST | `/api/users/login` | No | Login user |
| GET | `/api/users/profile` | Yes | Get user profile |
| PUT | `/api/users/profile` | Yes | Update profile |

### 📦 PRODUCTS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/products` | Vendor | Create product |
| GET | `/api/products` | No | Get all products |
| GET | `/api/products/:id` | No | Get product by ID |
| PUT | `/api/products/:id` | Owner | Update product |
| DELETE | `/api/products/:id` | Owner | Delete product |

**Query Params:** `?category=baskets&search=handmade&minPrice=100&maxPrice=500&isApproved=true`

### 🛠️ SERVICES
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/services` | Vendor | Create service |
| GET | `/api/services` | No | Get all services |
| GET | `/api/services/:id` | No | Get service by ID |
| PUT | `/api/services/:id` | Owner | Update service |
| DELETE | `/api/services/:id` | Owner | Delete service |

**Query Params:** `?category=laundry&location=Addis Ababa&isApproved=true`

### 🛒 ORDERS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Customer | Create order |
| GET | `/api/orders/my-orders` | Yes | Get my orders |
| GET | `/api/orders/:id` | Yes | Get order by ID |
| PUT | `/api/orders/:id/status` | Yes | Update order status |

**Order Status:** pending → confirmed → in_progress → completed / cancelled

### 📋 BULK ORDERS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bulk-orders` | Organization | Create bulk order |
| GET | `/api/bulk-orders` | Yes | Get bulk orders |
| PUT | `/api/bulk-orders/:id` | Yes | Update bulk order |

**Bulk Status:** requested → quoted → accepted → in_progress → completed

### ⭐ REVIEWS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | Customer | Create review |
| GET | `/api/reviews/vendor/:vendorId` | No | Get vendor reviews |

**Rating Categories:** Quality, Reliability, Service (1-5 stars each)

### 📚 FINANCIAL CONTENT
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/financial-content` | No | Get all content |
| GET | `/api/financial-content/:id` | No | Get content by ID |
| POST | `/api/financial-content` | Admin | Create content |

**Query Params:** `?category=pricing&contentType=video`

### 👥 VENDOR GROUPS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/vendor-groups` | Vendor | Create group |
| GET | `/api/vendor-groups` | No | Get all groups |
| POST | `/api/vendor-groups/:id/join` | Vendor | Join group |

### 🔐 ADMIN
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/admin/vendors/:id/approve` | Admin | Approve vendor |
| PUT | `/api/admin/products/:id/approve` | Admin | Approve product |
| PUT | `/api/admin/services/:id/approve` | Admin | Approve service |

---

## USER ROLES
- **customer** - Browse and buy products/services
- **vendor** - Sell products and offer services
- **organization** - Place bulk orders
- **admin** - Manage platform

---

## CATEGORIES

### Product Categories
- handmade_crafts
- food
- clothes
- jewelry
- baskets
- textiles
- other

### Service Categories
- laundry
- daycare
- cleaning
- cooking
- catering
- sewing
- hairdressing
- other

### Languages
- amharic
- afaan_oromo
- tigrinya
- english

### Payment Methods
- telebirr
- bank_transfer
- cash

---

## COMMON RESPONSE CODES
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

---

## EXAMPLE REQUESTS

### Register Vendor
```bash
POST /api/users/register
{
  "name": "Marta Bekele",
  "email": "marta@example.com",
  "password": "password123",
  "phone": "+251922345678",
  "role": "vendor",
  "language": "amharic",
  "skills": ["Laundry", "Cooking"],
  "location": {
    "city": "Addis Ababa",
    "subcity": "Kirkos"
  }
}
```

### Create Product
```bash
POST /api/products
Authorization: Bearer TOKEN
{
  "name": "Handmade Basket",
  "nameAmharic": "በእጅ የተሰራ ቅርጫት",
  "description": "Beautiful basket",
  "price": 250,
  "category": "baskets",
  "stock": 15,
  "images": ["url1.jpg"]
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer TOKEN
{
  "vendor": "vendorId",
  "items": [{
    "itemType": "product",
    "itemId": "productId",
    "itemName": "Handmade Basket",
    "quantity": 2,
    "price": 250,
    "subtotal": 500
  }],
  "totalAmount": 500,
  "paymentMethod": "telebirr",
  "deliveryAddress": {
    "city": "Addis Ababa",
    "phone": "+251911234567"
  }
}
```

### Submit Review
```bash
POST /api/reviews
Authorization: Bearer TOKEN
{
  "vendor": "vendorId",
  "order": "orderId",
  "itemType": "product",
  "ratings": {
    "quality": 5,
    "reliability": 5,
    "service": 4
  },
  "comment": "Excellent!"
}
```

---

## HEALTH CHECK
```bash
GET /health
Response: { "status": "ok", "message": "Empower-Her API is running" }
```
