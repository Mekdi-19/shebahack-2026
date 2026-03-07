import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenture } from '../context/VentureContext';

const MyVentures = () => {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();
  const { getVendorTeams, mockVendors } = useVenture();
  const [ventures, setVentures] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Redirect if not vendor
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  // Get vendor ID
  const getVendorId = () => {
    const vendor = mockVendors.find(v => v.name === user.name);
    return vendor?.id || 3;
  };

  // Load vendor's teams
  useEffect(() => {
    if (user && isVendor()) {
      const vendorId = getVendorId();
      const vendorTeams = getVendorTeams(vendorId);
      setVentures(vendorTeams);
    }
  }, [user, isVendor]);

  const filteredVentures = ventures.filter(v => {
    if (filter === 'all') return true;
    if (filter === 'active') return v.status === 'forming' || v.status === 'confirmed';
    if (filter === 'completed') return v.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      forming: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || badges.forming;
  };

  const getMyAssignment = (team) => {
    const vendorId = getVendorId();
    const member = team.members.find(m => m.vendorId === vendorId);
    return member || { assignedQuantity: 0, progress: 0 };
  };

  const handleViewWorkspace = (teamId) => {
    navigate(`/venture/${teamId}`);
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
          <h1 className="text-4xl font-bold text-text mb-2">My Venture Teams</h1>
          <p className="text-gray-600">Your active and completed team collaborations</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Teams
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'active' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'completed' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Ventures Grid */}
        {filteredVentures.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-text mb-2">No Teams Found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'You haven\'t joined any venture teams yet' 
                : `No ${filter} teams found`}
            </p>
            <button
              onClick={() => navigate('/venture-opportunities')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
              Check Invitations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVentures.map(team => {
              const myAssignment = getMyAssignment(team);
              const myEarnings = myAssignment.assignedQuantity * team.pricePerItem;
              const totalAssigned = team.members.reduce((sum, m) => sum + m.assignedQuantity, 0);
              const avgProgress = team.members.length > 0 
                ? Math.round(team.members.reduce((sum, m) => sum + m.progress, 0) / team.members.length)
                : 0;

              return (
                <div key={team.id} className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(team.status)}`}>
                      {team.status === 'forming' ? 'Forming Team' : 
                       team.status === 'confirmed' ? 'Confirmed' : 
                       'Completed'}
                    </span>
                  </div>

                  {/* Team Info */}
                  <h3 className="text-xl font-bold text-text mb-3">{team.product}</h3>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">📅 Deadline:</span>
                      <span className="font-semibold">{team.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">📍 Location:</span>
                      <span className="font-semibold">{team.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">👥 Team Size:</span>
                      <span className="font-semibold">{team.members.length} vendors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">📦 Total Order:</span>
                      <span className="font-semibold">{team.totalQuantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">✓ Assigned:</span>
                      <span className="font-semibold text-green-600">{totalAssigned} units</span>
                    </div>
                  </div>

                  {/* My Assignment */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold mb-2">Your Assignment</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-bold text-primary">{myAssignment.assignedQuantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Earnings:</span>
                        <span className="font-bold text-green-600">{myEarnings.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Progress:</span>
                        <span className="font-bold text-purple-600">{myAssignment.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Team Progress</span>
                      <span className="font-semibold text-primary">{avgProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          avgProgress === 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewWorkspace(team.id)}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Open Workspace →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {ventures.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Teams</p>
              <p className="text-3xl font-bold text-primary">{ventures.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Active Teams</p>
              <p className="text-3xl font-bold text-green-600">
                {ventures.filter(v => v.status === 'forming' || v.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600">
                {ventures.reduce((sum, team) => {
                  const myAssignment = getMyAssignment(team);
                  return sum + (myAssignment.assignedQuantity * team.pricePerItem);
                }, 0).toLocaleString()} ETB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVentures;
