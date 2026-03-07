import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { TeamProvider } from './context/TeamContext';
import { VentureProvider } from './context/VentureContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Services from './pages/Services';
import SpecialOffer from './pages/SpecialOffer';
import LearningCenter from './pages/LearningCenter';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import Checkout from './pages/Checkout';
import Booking from './pages/Booking';
import MyVentures from './pages/MyVentures';
import ProductDetails from './pages/ProductDetails';
import VentureOpportunities from './pages/VentureOpportunities';
import VendorProfile from './pages/VendorProfile';
import VendorProducts from './pages/VendorProducts';
import TeamWorkspace from './pages/TeamWorkspace';
import VentureWorkspace from './pages/VentureWorkspace';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <TeamProvider>
            <VentureProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/special-offer" element={<SpecialOffer />} />
                    <Route path="/learning" element={<LearningCenter />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/my-ventures" element={<MyVentures />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/vendor-products" element={<VendorProducts />} />
                    <Route path="/venture-opportunities" element={<VentureOpportunities />} />
                    <Route path="/vendor/:id" element={<VendorProfile />} />
                    <Route path="/team/:id" element={<TeamWorkspace />} />
                    <Route path="/venture/:id" element={<VentureWorkspace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </VentureProvider>
          </TeamProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
