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
import VendorProfile from './pages/VendorProfile';
import ProductDetails from './pages/ProductDetails';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import LearningCenter from './pages/LearningCenter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Teams from './pages/Teams';
import TeamWorkspace from './pages/TeamWorkspace';
import SpecialOffer from './pages/SpecialOffer';
import VentureOpportunities from './pages/VentureOpportunities';
import MyVentures from './pages/MyVentures';
import VentureWorkspace from './pages/VentureWorkspace';
import AdminDashboard from './pages/AdminDashboard';

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
                    <Route path="/vendor/:id" element={<VendorProfile />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/booking/:id" element={<Booking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/learning" element={<LearningCenter />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/team/:id" element={<TeamWorkspace />} />
                    <Route path="/special-offer" element={<SpecialOffer />} />
                    <Route path="/venture-opportunities" element={<VentureOpportunities />} />
                    <Route path="/my-ventures" element={<MyVentures />} />
                    <Route path="/venture/:id" element={<VentureWorkspace />} />
                    <Route path="/admin" element={<AdminDashboard />} />
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
