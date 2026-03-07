import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Booking = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    paymentMethod: 'cash'
  });

  const service = {
    id: 1,
    name: 'Professional Laundry Service',
    vendor: 'Almaz Tesfaye',
    price: 150
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking confirmed!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text mb-8">Book Service</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
          <p className="text-gray-600 mb-4">by {service.vendor}</p>
          <p className="text-3xl font-bold text-primary">{service.price} ETB</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Select Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Select Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
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
              placeholder="Enter your full address"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
            >
              <option value="cash">Cash on Service</option>
              <option value="mobile">Mobile Money</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
