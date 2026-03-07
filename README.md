# EmpowerHer Market

A modern responsive web application built with React.js and Tailwind CSS that empowers Ethiopian women to sell homemade products and offer local services.

## 🎉 Latest Updates

### 1. Marketplace Page - Simplified
- ✅ Removed side filter sidebar
- ✅ Search bar at the top
- ✅ Search by product name, category, or seller
- ✅ Responsive grid layout (1-4 columns based on screen size)
- ✅ Clean, minimal design

### 2. Services Page - Filter Buttons
- ✅ Removed filter cards and dropdowns
- ✅ Top filter buttons for service types (tags style)
- ✅ Dynamic filtering on button click
- ✅ Vendor names are clickable and navigate to vendor profiles
- ✅ Search bar integration

### 3. Learning Center - Simplified Filters
- ✅ Removed price and interest filters
- ✅ Only filter by skill (Cooking, Crafts, Sewing, Small Business, Financial Literacy)
- ✅ Learning cards display: title, description, skill, Free/Paid badge
- ✅ Dynamic filtering

### 4. Role-Based Authentication
- ✅ Mock login system with 3 roles: Admin, Customer, Vendor
- ✅ Demo credentials displayed on login page
- ✅ Role selection during login
- ✅ Context API for auth state management
- ✅ Persistent login (localStorage)

**Demo Credentials:**
- Admin: `admin@empowerher.et` / `admin123`
- Customer: `customer@test.et` / `customer123`
- Vendor: `vendor@test.et` / `vendor123`

### 5. Vendor Dashboard - Role-Based Access
- ✅ Only accessible to vendors
- ✅ Redirects non-vendors to home page
- ✅ Stats: Total Orders, Total Earnings, Active Listings
- ✅ Tabs: Overview, Products, Services, Orders
- ✅ Mock data for products, services, and orders
- ✅ Product management (view, edit, delete buttons)
- ✅ Service management
- ✅ Orders list

### 6. Navigation Updates
- ✅ Dashboard link only visible to vendors
- ✅ User greeting in navbar
- ✅ Logout functionality
- ✅ Active page highlighting
- ✅ Role-based navigation

### 7. UX Improvements
- ✅ Clean, mobile-first design
- ✅ Top search bars for Marketplace and Services
- ✅ Filter buttons instead of side cards
- ✅ Responsive grids
- ✅ Clear role-based navigation
- ✅ Smooth transitions and hover effects

## Features

- 🛍️ **Marketplace** - Browse products with search functionality
- 💼 **Services** - Book services with filter buttons
- 👩‍💼 **Vendor Profiles** - Detailed vendor information
- 📊 **Vendor Dashboard** - Role-based access for vendors only
- 📚 **Learning Center** - Skill-based course filtering
- 🛒 **Shopping Cart** - Full e-commerce functionality
- 🔐 **Authentication** - Role-based login (Admin, Customer, Vendor)
- 🌍 **Multi-language Support** - English, Amharic, Afaan Oromo, Tigrinya
- 📱 **Mobile-Friendly** - Responsive design

## Tech Stack

- React 19.2.0
- React Router DOM 6.x
- Tailwind CSS 3.x
- Context API (Cart & Auth state management)
- Vite 7.x
- Mock authentication system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hackaton
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Testing Authentication

Use these credentials to test different roles:

**Vendor Access:**
- Email: `vendor@test.et`
- Password: `vendor123`
- Role: Vendor
- Access: Dashboard + all pages

**Customer Access:**
- Email: `customer@test.et`
- Password: `customer123`
- Role: Customer
- Access: All pages except Dashboard

**Admin Access:**
- Email: `admin@empowerher.et`
- Password: `admin123`
- Role: Admin
- Access: All pages except Dashboard

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx (Role-based navigation + logout)
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ServiceCard.jsx (Clickable vendor names)
│   ├── VendorCard.jsx
│   ├── RatingStars.jsx
│   ├── SearchBar.jsx
│   ├── OrderCard.jsx
│   ├── ReviewCard.jsx
│   ├── VideoModal.jsx
│   └── HowItWorksCard.jsx
├── context/
│   ├── CartContext.jsx (Cart state management)
│   └── AuthContext.jsx (NEW - Auth state management)
├── pages/
│   ├── Home.jsx (Skip tutorial + video modals)
│   ├── Marketplace.jsx (No side filters, search only)
│   ├── Services.jsx (Filter buttons, no dropdowns)
│   ├── VendorProfile.jsx
│   ├── ProductDetails.jsx (Working cart buttons)
│   ├── Booking.jsx
│   ├── Dashboard.jsx (Role-based access, mock data)
│   ├── LearningCenter.jsx (Skill filter only)
│   ├── Login.jsx (Role-based authentication)
│   ├── Signup.jsx
│   ├── Cart.jsx
│   └── Checkout.jsx
├── services/
│   └── api.js
├── App.jsx (AuthProvider + CartProvider)
└── main.jsx
```

## Key Features

### Authentication System
- Mock user database with 4 users
- Role-based access control
- Persistent login with localStorage
- Protected routes (Dashboard)
- Logout functionality

### Dashboard (Vendor Only)
- Stats overview
- Product management with mock data
- Service management with mock data
- Orders list
- Tab-based navigation

### Simplified Filtering
- Marketplace: Search only (no side filters)
- Services: Top filter buttons
- Learning: Skill filter only

### Navigation
- Role-based menu items
- Active page highlighting
- User greeting
- Cart count badge
- Logout button

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Color Scheme

Ethiopian-inspired colors:
- Primary: #CFAF2F (Gold)
- Secondary: #E63946 (Red)
- Background: #FFFFFF (White)
- Text: #333333 (Dark Gray)

## Mock Data

### Users
- 1 Admin
- 1 Customer  
- 2 Vendors

### Dashboard Data (Vendors)
- 4 Products with images, prices, stock
- 3 Services with bookings count
- 4 Orders with status tracking

## Future Enhancements

- Backend API integration
- Real authentication with JWT
- Database integration
- Payment gateway
- Real-time notifications
- File upload for products
- Advanced analytics
- Email notifications
- Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
