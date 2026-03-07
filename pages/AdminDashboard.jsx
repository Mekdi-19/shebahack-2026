import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenture } from '../context/VentureContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const {
    specialOfferRequests,
    ventureTeams,
    pendingUsers,
    mockVendors,
    getSuggestedVendors,
    acceptSpecialOfferRequest,
    rejectSpecialOfferRequest,
    approveUser,
    rejectUser,
    createVentureTeam,
    createStandaloneTeam,
    updateVentureTeam,
    removeVendorFromTeam,
    sendVendorInvitation,
    deleteVentureTeam
  } = useVenture();

  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showInviteVendor, setShowInviteVendor] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Team creation form
  const [teamForm, setTeamForm] = useState({
    product: '',
    totalQuantity: 0,
    pricePerItem: 0,
    deadline: '',
    location: ''
  });

  // Vendor invitation form
  const [inviteForm, setInviteForm] = useState({
    vendorId: '',
    assignedQuantity: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleCreateTeamClick = (request) => {
    if (request.status !== 'accepted') {
      alert('Please accept the request first before creating a team');
      return;
    }
    setSelectedRequest(request);
    setTeamForm({
      product: request.itemName,
      totalQuantity: request.quantity,
      pricePerItem: (request.minPrice + request.maxPrice) / 2,
      deadline: request.deliveryDate,
      location: request.customerLocation || 'Addis Ababa'
    });
    setShowCreateTeam(true);
  };

  const handleAcceptRequest = (requestId) => {
    acceptSpecialOfferRequest(requestId);
    alert('Request accepted! You can now create a team for this order.');
  };

  const handleRejectRequestClick = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectRequest = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    rejectSpecialOfferRequest(selectedRequest.id, rejectReason);
    setShowRejectModal(false);
    alert('Request rejected');
  };

  const handleCreateTeam = () => {
    if (!teamForm.product || !teamForm.totalQuantity || !teamForm.pricePerItem || !teamForm.deadline) {
      alert('Please fill all required fields');
      return;
    }

    // If creating from a request
    if (selectedRequest) {
      createVentureTeam(selectedRequest.id, teamForm);
    } else {
      // Creating standalone team (no request)
      createStandaloneTeam(teamForm);
    }
    
    setShowCreateTeam(false);
    setSelectedRequest(null);
    alert('Venture team created successfully!');
  };

  const handleInviteVendorClick = (team) => {
    setSelectedTeam(team);
    setInviteForm({ vendorId: '', assignedQuantity: 0 });
    setShowInviteVendor(true);
  };

  const handleSendInvitation = () => {
    if (!selectedTeam || !inviteForm.vendorId || !inviteForm.assignedQuantity) {
      alert('Please select a vendor and enter quantity');
      return;
    }

    sendVendorInvitation(
      selectedTeam.id,
      parseInt(inviteForm.vendorId),
      parseInt(inviteForm.assignedQuantity)
    );

    setShowInviteVendor(false);
    alert('Invitation sent to vendor!');
  };

  const handleDeleteTeam = (teamId) => {
    if (confirm('Are you sure you want to delete this team?')) {
      deleteVentureTeam(teamId);
      alert('Team deleted successfully');
    }
  };

  const handleEditTeamClick = (team) => {
    setSelectedTeam(team);
    setShowEditTeam(true);
  };

  const handleRemoveVendor = (teamId, vendorId, vendorName) => {
    if (confirm(`Remove ${vendorName} from this team?`)) {
      removeVendorFromTeam(teamId, vendorId);
      alert('Vendor removed from team');
    }
  };

  const handleApproveUser = (userId, userName) => {
    if (confirm(`Approve ${userName}?`)) {
      approveUser(userId);
      alert('User approved successfully');
    }
  };

  const handleRejectUser = (userId, userName) => {
    const reason = prompt(`Reason for rejecting ${userName}:`);
    if (reason) {
      rejectUser(userId, reason);
      alert('User rejected');
    }
  };

  const getSuggestedVendorsForRequest = (request) => {
    const avgPrice = (request.minPrice + request.maxPrice) / 2;
    return getSuggestedVendors(request.itemName, avgPrice, 'Addis Ababa', request.quantity);
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage venture teams and special offer requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Pending Requests</p>
            <p className="text-4xl font-bold text-yellow-600">
              {specialOfferRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Active Teams</p>
            <p className="text-4xl font-bold text-green-600">
              {ventureTeams.filter(t => t.status === 'forming' || t.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Pending Users</p>
            <p className="text-4xl font-bold text-orange-600">
              {pendingUsers.filter(u => u.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Total Vendors</p>
            <p className="text-4xl font-bold text-primary">{mockVendors.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Special Offer Requests
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'teams' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Venture Teams
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'vendors' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Vendor Database
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Special Offer Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Special Offer Requests</h2>
                {specialOfferRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-600">No special offer requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {specialOfferRequests.map(request => (
                      <div key={request.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{request.itemName}</h3>
                            <p className="text-gray-600">Customer: {request.customerName}</p>
                            <p className="text-sm text-gray-500">Type: {request.itemType}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'team-created' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Quantity</p>
                            <p className="font-semibold">{request.quantity} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price Range</p>
                            <p className="font-semibold">{request.minPrice} - {request.maxPrice} ETB</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Delivery Date</p>
                            <p className="font-semibold">{request.deliveryDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Submitted</p>
                            <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {request.description && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Description:</p>
                            <p className="text-gray-800">{request.description}</p>
                          </div>
                        )}

                        {/* Suggested Vendors */}
                        {request.status === 'pending' && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                            <p className="font-semibold mb-2">💡 Suggested Vendors:</p>
                            <div className="flex flex-wrap gap-2">
                              {getSuggestedVendorsForRequest(request).slice(0, 5).map(vendor => (
                                <span key={vendor.id} className="px-3 py-1 bg-white rounded-full text-sm">
                                  {vendor.name} ⭐{vendor.rating}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                              >
                                ✓ Accept Request
                              </button>
                              <button
                                onClick={() => handleRejectRequestClick(request)}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {request.status === 'accepted' && (
                            <button
                              onClick={() => handleCreateTeamClick(request)}
                              className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                            >
                              Create Venture Team
                            </button>
                          )}
                          {request.status === 'team-created' && (
                            <div className="w-full text-center py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                              Team Created ✓
                            </div>
                          )}
                          {request.status === 'rejected' && (
                            <div className="w-full">
                              <div className="text-center py-2 bg-red-100 text-red-800 rounded-lg font-semibold mb-2">
                                Rejected
                              </div>
                              {request.rejectionReason && (
                                <p className="text-sm text-gray-600">Reason: {request.rejectionReason}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Venture Teams Tab */}
            {activeTab === 'teams' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Venture Teams</h2>
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setTeamForm({
                        product: '',
                        totalQuantity: 0,
                        pricePerItem: 0,
                        deadline: '',
                        location: 'Addis Ababa'
                      });
                      setShowCreateTeam(true);
                    }}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold flex items-center gap-2"
                  >
                    <span className="text-xl">+</span> Create New Team
                  </button>
                </div>
                
                {ventureTeams.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-gray-600 mb-4">No venture teams created yet</p>
                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setTeamForm({
                          product: '',
                          totalQuantity: 0,
                          pricePerItem: 0,
                          deadline: '',
                          location: 'Addis Ababa'
                        });
                        setShowCreateTeam(true);
                      }}
                      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                    >
                      Create Your First Team
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ventureTeams.map(team => {
                      const totalAssigned = team.members.reduce((sum, m) => sum + m.assignedQuantity, 0);
                      const remaining = team.totalQuantity - totalAssigned;
                      
                      return (
                        <div key={team.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold">{team.product}</h3>
                              <p className="text-sm text-gray-600">Team #{team.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              team.status === 'forming' ? 'bg-yellow-100 text-yellow-800' :
                              team.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {team.status}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Quantity:</span>
                              <span className="font-semibold">{team.totalQuantity} units</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Assigned:</span>
                              <span className="font-semibold text-green-600">{totalAssigned} units</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Remaining:</span>
                              <span className="font-semibold text-orange-600">{remaining} units</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Price per Item:</span>
                              <span className="font-semibold">{team.pricePerItem} ETB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Deadline:</span>
                              <span className="font-semibold">{team.deadline}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Team Members:</span>
                              <span className="font-semibold">{team.members.length} vendors</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(totalAssigned / team.totalQuantity) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {Math.round((totalAssigned / team.totalQuantity) * 100)}% Capacity Filled
                            </p>
                          </div>

                          {/* Team Members */}
                          {team.members.length > 0 && (
                            <div className="mb-4 p-3 bg-white rounded">
                              <p className="text-sm font-semibold mb-2">Team Members:</p>
                              <div className="space-y-2">
                                {team.members.map((member, idx) => (
                                  <div key={idx} className="text-sm flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold">{member.vendorName}</span>
                                      <span className="text-gray-600 ml-2">({member.assignedQuantity} units)</span>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveVendor(team.id, member.vendorId, member.vendorName)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleInviteVendorClick(team)}
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                            >
                              + Add Member
                            </button>
                            <button
                              onClick={() => handleEditTeamClick(team)}
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">User Management</h2>
                
                {/* Mock pending users for demo */}
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👤</div>
                    <h3 className="text-xl font-bold mb-2">No Pending Users</h3>
                    <p className="text-gray-600">All user registrations have been processed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map(user => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                              user.role === 'vendor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>

                        {user.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveUser(user.id, user.name)}
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.id, user.name)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        )}

                        {user.status === 'rejected' && user.rejectionReason && (
                          <div className="mt-2 p-3 bg-red-50 rounded">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Rejection Reason:</span> {user.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">💡 User Management Guidelines</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Review each registration carefully before approval</li>
                    <li>• Verify vendor credentials and product/service offerings</li>
                    <li>• Reject suspicious or incomplete registrations</li>
                    <li>• Approved users gain immediate access to the platform</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Vendor Database Tab */}
            {activeTab === 'vendors' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Vendor Database</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockVendors.map(vendor => (
                    <div key={vendor.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                      <h3 className="text-lg font-bold mb-2">{vendor.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-semibold">⭐ {vendor.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-semibold">{vendor.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price Range:</span>
                          <span className="font-semibold">{vendor.priceRange.min} - {vendor.priceRange.max} ETB</span>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Products:</p>
                          <div className="flex flex-wrap gap-1">
                            {vendor.products.map((product, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white rounded text-xs">
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {selectedRequest ? 'Create Venture Team for Request' : 'Create New Venture Team'}
            </h2>
            
            {selectedRequest && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold mb-1">Request: {selectedRequest.itemName}</p>
                <p className="text-sm text-gray-600">Customer: {selectedRequest.customerName}</p>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Product/Service *</label>
                <input
                  type="text"
                  value={teamForm.product}
                  onChange={(e) => setTeamForm({ ...teamForm, product: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="e.g., Handmade Baskets"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Total Quantity *</label>
                <input
                  type="number"
                  value={teamForm.totalQuantity}
                  onChange={(e) => setTeamForm({ ...teamForm, totalQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-4 py-2"
                  min="1"
                  placeholder="e.g., 500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price per Item (ETB) *</label>
                <input
                  type="number"
                  value={teamForm.pricePerItem}
                  onChange={(e) => setTeamForm({ ...teamForm, pricePerItem: parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-4 py-2"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 70"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Deadline *</label>
                <input
                  type="date"
                  value={teamForm.deadline}
                  onChange={(e) => setTeamForm({ ...teamForm, deadline: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location *</label>
                <select
                  value={teamForm.location}
                  onChange={(e) => setTeamForm({ ...teamForm, location: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                >
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                  <option value="Hawassa">Hawassa</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                  <option value="Mekelle">Mekelle</option>
                  <option value="Gondar">Gondar</option>
                  <option value="Adama">Adama</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCreateTeam}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                Create Team
              </button>
              <button
                onClick={() => setShowCreateTeam(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Vendor Modal */}
      {showInviteVendor && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Invite Vendor to Team</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold mb-2">Team: {selectedTeam.product}</p>
              <p className="text-sm text-gray-600">
                Remaining Capacity: {selectedTeam.totalQuantity - selectedTeam.members.reduce((sum, m) => sum + m.assignedQuantity, 0)} units
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Vendor</label>
                <select
                  value={inviteForm.vendorId}
                  onChange={(e) => setInviteForm({ ...inviteForm, vendorId: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Choose a vendor...</option>
                  {mockVendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - ⭐{vendor.rating} - {vendor.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Assigned Quantity</label>
                <input
                  type="number"
                  value={inviteForm.assignedQuantity}
                  onChange={(e) => setInviteForm({ ...inviteForm, assignedQuantity: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSendInvitation}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                Send Invitation
              </button>
              <button
                onClick={() => setShowInviteVendor(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Reject Request</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this special offer request:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-6"
              rows="4"
              placeholder="e.g., Unrealistic quantity, Price too low, etc."
            />
            <div className="flex gap-4">
              <button
                onClick={handleRejectRequest}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditTeam && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Team Details</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Product/Service</label>
                <input
                  type="text"
                  value={selectedTeam.product}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, product: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Total Quantity</label>
                <input
                  type="number"
                  value={selectedTeam.totalQuantity}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, totalQuantity: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price per Item (ETB)</label>
                <input
                  type="number"
                  value={selectedTeam.pricePerItem}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, pricePerItem: parseFloat(e.target.value) })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Deadline</label>
                <input
                  type="date"
                  value={selectedTeam.deadline}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, deadline: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  value={selectedTeam.location}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, location: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  updateVentureTeam(selectedTeam.id, selectedTeam);
                  setShowEditTeam(false);
                  alert('Team updated successfully');
                }}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditTeam(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
