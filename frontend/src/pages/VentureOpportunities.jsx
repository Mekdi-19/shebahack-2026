import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenture } from '../context/VentureContext';

const VentureOpportunities = () => {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();
  const { getVendorInvitations, acceptInvitation, rejectInvitation, mockVendors } = useVenture();
  const [invitations, setInvitations] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});

  // Redirect if not vendor
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  // Get vendor ID from mock vendors (match by name)
  const getVendorId = () => {
    const vendor = mockVendors.find(v => v.name === user.name);
    return vendor?.id || 3; // Default to vendor ID 3 if not found
  };

  // Load invitations
  useEffect(() => {
    if (user && isVendor()) {
      const vendorId = getVendorId();
      const vendorInvitations = getVendorInvitations(vendorId).filter(inv => inv.status === 'pending');
      setInvitations(vendorInvitations);
    }
  }, [user, isVendor]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      invitations.forEach(inv => {
        const now = new Date();
        const expiresAt = new Date(inv.expiresAt);
        const diff = expiresAt - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeRemaining[inv.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeRemaining[inv.id] = 'Expired';
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [invitations]);

  const handleAccept = (invitation) => {
    const vendorId = getVendorId();
    const success = acceptInvitation(invitation.id, vendorId);
    
    if (success) {
      alert(`You have accepted the venture! Assigned quantity: ${invitation.assignedQuantity} units`);
      setInvitations(invitations.filter(inv => inv.id !== invitation.id));
    } else {
      alert('Failed to accept invitation');
    }
  };

  const handleReject = (invitation) => {
    if (confirm('Are you sure you want to reject this venture opportunity?')) {
      const vendorId = getVendorId();
      const success = rejectInvitation(invitation.id, vendorId);
      
      if (success) {
        setInvitations(invitations.filter(inv => inv.id !== invitation.id));
        alert('Invitation rejected. The admin will be notified.');
      } else {
        alert('Failed to reject invitation');
      }
    }
  };

  if (!user || !isVendor()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:underline mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-text mb-2">Team Job Invitations</h1>
          <p className="text-gray-600">Review and respond to venture team invitations from the admin</p>
        </div>

        {invitations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-text mb-2">No Pending Invitations</h2>
            <p className="text-gray-600">You don't have any team job invitations at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map(inv => {
              const totalEarnings = inv.assignedQuantity * inv.pricePerItem;
              
              return (
                <div key={inv.id} className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
                  {/* Time Remaining Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      timeRemaining[inv.id] === 'Expired' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      ⏰ {timeRemaining[inv.id] || 'Loading...'}
                    </span>
                  </div>

                  {/* Job Information */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-text mb-2">{inv.product}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📍 Location: {inv.location}</p>
                      <p>💰 Price per item: {inv.pricePerItem} ETB</p>
                      <p>📦 Total Order: {inv.totalQuantity} units</p>
                      <p>📅 Deadline: {inv.deadline}</p>
                    </div>
                  </div>

                  {/* Your Assignment */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-text mb-2">Your Assignment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned Quantity:</span>
                        <span className="font-bold text-primary">{inv.assignedQuantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Earnings:</span>
                        <span className="font-bold text-green-600">{totalEarnings.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Share:</span>
                        <span className="font-semibold">
                          {Math.round((inv.assignedQuantity / inv.totalQuantity) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Important Note */}
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-gray-700">
                      ⚠️ This is a team collaboration. Other vendors will handle the remaining quantity.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAccept(inv)}
                      disabled={timeRemaining[inv.id] === 'Expired'}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      ✓ Accept Job
                    </button>
                    <button
                      onClick={() => handleReject(inv)}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">💡 How Team Jobs Work</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• The admin creates teams based on customer orders</li>
            <li>• You receive invitations with your assigned production quantity</li>
            <li>• Accept to join the team and collaborate with other vendors</li>
            <li>• Complete your assigned quantity by the deadline</li>
            <li>• Earn your share of the total order value</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VentureOpportunities;
