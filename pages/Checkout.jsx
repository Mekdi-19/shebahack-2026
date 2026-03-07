import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    mpesaPhone: '',
    mpesaAmount: getCartTotal()
  });
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, mpesaAmount: getCartTotal() }));
  }, [getCartTotal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const newOrders = cart.map(item => ({
      ...item,
      status: 'ordered',
      orderDate: new Date().toISOString(),
      paymentMethod: 'M-Pesa',
      mpesaPhone: formData.mpesaPhone
    }));
    
    localStorage.setItem('customerOrders', JSON.stringify([...existingOrders, ...newOrders]));
    
    // Show success message
    setShowPaymentSuccess(true);
    
    // Clear cart and redirect after 3 seconds
    setTimeout(() => {
      clearCart();
      navigate('/cart');
    }, 3000);
  };

  if (!user || cart.length === 0) {
    return null;
  }

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-12 max-w-md text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Request Sent!</h2>
          <p className="text-gray-600 text-lg mb-2">
            Payment request sent to your M-Pesa phone
          </p>
          <p className="text-gray-500 mb-6">
            Phone: {formData.mpesaPhone}
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to orders page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                  <option value="Mekelle">Mekelle</option>
                  <option value="Hawassa">Hawassa</option>
                </select>
              </div>

              <h2 className="text-2xl font-bold mb-6 mt-8">M-Pesa Payment</h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">📱</span>
                  <div>
                    <h3 className="font-bold text-lg text-green-800">Pay with M-Pesa</h3>
                    <p className="text-sm text-green-600">Secure mobile money payment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      M-Pesa Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.mpesaPhone}
                      onChange={(e) => setFormData({...formData, mpesaPhone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
                      placeholder="+251 9XX XXX XXX"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the phone number registered with M-Pesa
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Amount (ETB)</label>
                    <input
                      type="number"
                      value={formData.mpesaAmount}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-gray-100 font-bold text-green-700"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> After clicking "Confirm Payment", you will receive an M-Pesa prompt on your phone. Enter your M-Pesa PIN to complete the payment.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg text-lg font-semibold transition"
              >
                Confirm M-Pesa Payment
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-text mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">{item.price * item.quantity} ETB</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{getCartTotal()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">{getCartTotal()} ETB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
