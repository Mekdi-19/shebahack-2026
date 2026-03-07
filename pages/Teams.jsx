import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Teams = () => {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  if (!user || !isVendor()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Team Collaboration</h1>
          <p className="text-gray-600">Collaborate with other vendors through admin-managed teams</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-2xl font-bold text-text mb-4">Admin-Managed Collaboration</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Team collaboration on EmpowerHer Market is managed by platform administrators. 
              When large orders require multiple vendors, the admin will create teams and send you invitations.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-text mb-4">📋 How Team Collaboration Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Customer Places Large Order</h4>
                <p className="text-gray-700">A customer submits a special offer request for a bulk order that requires multiple vendors.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Admin Creates Team</h4>
                <p className="text-gray-700">The platform admin reviews the request and creates a collaboration team, selecting suitable vendors.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">You Receive Invitation</h4>
                <p className="text-gray-700">You'll receive a team invitation with details about the order, your assigned quantity, and earnings.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Accept or Reject</h4>
                <p className="text-gray-700">Review the invitation and decide whether to accept or reject based on your capacity and timeline.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold mb-1">Collaborate & Complete</h4>
                <p className="text-gray-700">Once you accept, work on your assigned quantity and track progress in the team workspace.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">📬</div>
              <div>
                <h3 className="text-xl font-bold text-text">Venture Opportunities</h3>
                <p className="text-gray-600 text-sm">View pending team invitations</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/venture-opportunities')}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
            >
              Check Invitations
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">👥</div>
              <div>
                <h3 className="text-xl font-bold text-text">My Ventures</h3>
                <p className="text-gray-600 text-sm">View your active team collaborations</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/my-ventures')}
              className="w-full bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
            >
              View My Teams
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-text mb-4">✨ Benefits of Team Collaboration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h4 className="font-semibold">Access Larger Orders</h4>
                <p className="text-gray-700 text-sm">Participate in bulk orders you couldn't handle alone</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h4 className="font-semibold">Fair Distribution</h4>
                <p className="text-gray-700 text-sm">Admin ensures fair task allocation based on capacity</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h4 className="font-semibold">No Management Burden</h4>
                <p className="text-gray-700 text-sm">Focus on production while admin handles coordination</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h4 className="font-semibold">Clear Earnings</h4>
                <p className="text-gray-700 text-sm">See your potential earnings before accepting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
