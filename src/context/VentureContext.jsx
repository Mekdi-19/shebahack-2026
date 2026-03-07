import { createContext, useContext, useState, useEffect } from 'react';

const VentureContext = createContext();

export const useVenture = () => {
  const context = useContext(VentureContext);
  if (!context) {
    throw new Error('useVenture must be used within VentureProvider');
  }
  return context;
};

// Mock vendors database with ratings, location, and price ranges
const mockVendors = [
  { id: 1, name: 'Almaz Tesfaye', rating: 4.8, location: 'Addis Ababa', priceRange: { min: 50, max: 100 }, products: ['Baskets', 'Crafts'] },
  { id: 2, name: 'Tigist Bekele', rating: 4.9, location: 'Addis Ababa', priceRange: { min: 60, max: 120 }, products: ['Cookies', 'Food'] },
  { id: 3, name: 'Marta Haile', rating: 4.7, location: 'Bahir Dar', priceRange: { min: 40, max: 90 }, products: ['Baskets', 'Crafts'] },
  { id: 4, name: 'Selam Mulugeta', rating: 4.6, location: 'Addis Ababa', priceRange: { min: 70, max: 150 }, products: ['Coffee Sets', 'Food'] },
  { id: 5, name: 'Hana Tadesse', rating: 4.5, location: 'Hawassa', priceRange: { min: 45, max: 85 }, products: ['Spices', 'Food'] },
  { id: 6, name: 'Bethlehem Kebede', rating: 4.8, location: 'Addis Ababa', priceRange: { min: 55, max: 110 }, products: ['Jewelry', 'Crafts'] },
  { id: 7, name: 'Sara Gebre', rating: 4.4, location: 'Dire Dawa', priceRange: { min: 50, max: 95 }, products: ['Baskets', 'Crafts'] },
  { id: 8, name: 'Rahel Yohannes', rating: 4.7, location: 'Bahir Dar', priceRange: { min: 65, max: 130 }, products: ['Cookies', 'Food'] }
];

export const VentureProvider = ({ children }) => {
  const [specialOfferRequests, setSpecialOfferRequests] = useState([]);
  const [ventureTeams, setVentureTeams] = useState([]);
  const [vendorInvitations, setVendorInvitations] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('specialOfferRequests');
    const savedTeams = localStorage.getItem('ventureTeams');
    const savedInvitations = localStorage.getItem('vendorInvitations');
    const savedPendingUsers = localStorage.getItem('pendingUsers');
    
    // Initialize with mock special offer requests if none exist
    if (savedRequests) {
      setSpecialOfferRequests(JSON.parse(savedRequests));
    } else {
      const mockRequests = [
        {
          id: 2001,
          customerId: 2,
          customerName: 'Test Customer',
          itemType: 'product',
          itemName: 'Handmade Basket',
          quantity: 500,
          minPrice: 60,
          maxPrice: 80,
          deliveryDate: '2026-07-15',
          customerLocation: 'Addis Ababa',
          description: 'Need 500 traditional handmade baskets for a hotel chain. Quality is important.',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2002,
          customerId: 2,
          customerName: 'Test Customer',
          itemType: 'product',
          itemName: 'Traditional Coffee Set',
          quantity: 200,
          minPrice: 700,
          maxPrice: 900,
          deliveryDate: '2026-08-01',
          customerLocation: 'Bahir Dar',
          description: 'Traditional Ethiopian coffee sets for a cultural center.',
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2003,
          customerId: 2,
          customerName: 'Test Customer',
          itemType: 'service',
          itemName: 'Cooking Service',
          quantity: 50,
          minPrice: 300,
          maxPrice: 500,
          deliveryDate: '2026-06-30',
          customerLocation: 'Addis Ababa',
          description: 'Need catering service for 50 events over 2 months.',
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ];
      setSpecialOfferRequests(mockRequests);
    }
    
    if (savedTeams) setVentureTeams(JSON.parse(savedTeams));
    if (savedInvitations) setVendorInvitations(JSON.parse(savedInvitations));
    
    // Initialize with mock pending users if none exist
    if (savedPendingUsers) {
      setPendingUsers(JSON.parse(savedPendingUsers));
    } else {
      const mockPendingUsers = [
        {
          id: 1001,
          name: 'Selamawit Tadesse',
          email: 'selam@example.et',
          role: 'vendor',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 1002,
          name: 'Yohannes Kebede',
          email: 'yohannes@example.et',
          role: 'customer',
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 1003,
          name: 'Meseret Haile',
          email: 'meseret@example.et',
          role: 'vendor',
          status: 'pending',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];
      setPendingUsers(mockPendingUsers);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('specialOfferRequests', JSON.stringify(specialOfferRequests));
  }, [specialOfferRequests]);

  useEffect(() => {
    localStorage.setItem('ventureTeams', JSON.stringify(ventureTeams));
  }, [ventureTeams]);

  useEffect(() => {
    localStorage.setItem('vendorInvitations', JSON.stringify(vendorInvitations));
  }, [vendorInvitations]);

  useEffect(() => {
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  // Add special offer request (from customer)
  const addSpecialOfferRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString()
    };
    setSpecialOfferRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  // Accept special offer request (Admin only)
  const acceptSpecialOfferRequest = (requestId) => {
    setSpecialOfferRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status: 'accepted' } : req)
    );
  };

  // Reject special offer request (Admin only)
  const rejectSpecialOfferRequest = (requestId, reason) => {
    setSpecialOfferRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status: 'rejected', rejectionReason: reason } : req)
    );
  };

  // User management
  const addPendingUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setPendingUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const approveUser = (userId) => {
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    // In a real app, this would add the user to the active users database
  };

  const rejectUser = (userId, reason) => {
    setPendingUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, status: 'rejected', rejectionReason: reason } : u)
    );
  };

  // Get vendor suggestions based on criteria
  const getSuggestedVendors = (productType, pricePerItem, location, requiredQuantity) => {
    // Filter vendors
    let filtered = mockVendors.filter(vendor => {
      const matchesProduct = vendor.products.some(p => 
        p.toLowerCase().includes(productType.toLowerCase()) || 
        productType.toLowerCase().includes(p.toLowerCase())
      );
      const matchesPrice = pricePerItem >= vendor.priceRange.min && pricePerItem <= vendor.priceRange.max;
      const matchesLocation = vendor.location === location;
      
      return matchesProduct && matchesPrice;
    });

    // Sort by: location match first, then rating
    filtered.sort((a, b) => {
      if (a.location === location && b.location !== location) return -1;
      if (a.location !== location && b.location === location) return 1;
      return b.rating - a.rating;
    });

    return filtered;
  };

  // Create venture team (Admin only)
  const createVentureTeam = (requestId, teamData) => {
    const newTeam = {
      ...teamData,
      id: Date.now(),
      requestId,
      status: 'forming', // forming, confirmed, active, completed
      createdAt: new Date().toISOString(),
      members: []
    };
    setVentureTeams(prev => [...prev, newTeam]);
    
    // Update request status
    setSpecialOfferRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'team-created' } : req)
    );
    
    return newTeam;
  };

  // Create standalone team without request (Admin only)
  const createStandaloneTeam = (teamData) => {
    const newTeam = {
      ...teamData,
      id: Date.now(),
      requestId: null,
      status: 'forming',
      createdAt: new Date().toISOString(),
      members: []
    };
    setVentureTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  // Update team (Admin only)
  const updateVentureTeam = (teamId, updates) => {
    setVentureTeams(prev =>
      prev.map(team => team.id === teamId ? { ...team, ...updates } : team)
    );
  };

  // Remove vendor from team (Admin only)
  const removeVendorFromTeam = (teamId, vendorId) => {
    setVentureTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(m => m.vendorId !== vendorId)
          };
        }
        return team;
      })
    );
    
    // Also remove any pending invitations for this vendor
    setVendorInvitations(prev =>
      prev.filter(inv => !(inv.teamId === teamId && inv.vendorId === vendorId))
    );
  };

  // Send invitation to vendor (Admin only)
  const sendVendorInvitation = (teamId, vendorId, assignedQuantity) => {
    const team = ventureTeams.find(t => t.id === teamId);
    const vendor = mockVendors.find(v => v.id === vendorId);
    
    if (!team || !vendor) return null;

    const invitation = {
      id: Date.now(),
      teamId,
      vendorId,
      vendorName: vendor.name,
      assignedQuantity,
      product: team.product,
      pricePerItem: team.pricePerItem,
      deadline: team.deadline,
      location: team.location,
      totalQuantity: team.totalQuantity,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      sentAt: new Date().toISOString()
    };

    setVendorInvitations(prev => [...prev, invitation]);
    return invitation;
  };

  // Vendor accepts invitation
  const acceptInvitation = (invitationId, vendorId) => {
    const invitation = vendorInvitations.find(i => i.id === invitationId);
    if (!invitation || invitation.vendorId !== vendorId) return false;

    // Update invitation status
    setVendorInvitations(prev =>
      prev.map(inv => inv.id === invitationId ? { ...inv, status: 'accepted' } : inv)
    );

    // Add vendor to team
    const team = ventureTeams.find(t => t.id === invitation.teamId);
    if (team) {
      setVentureTeams(prev =>
        prev.map(t => t.id === invitation.teamId ? {
          ...t,
          members: [...t.members, {
            vendorId: invitation.vendorId,
            vendorName: invitation.vendorName,
            assignedQuantity: invitation.assignedQuantity,
            progress: 0,
            joinedAt: new Date().toISOString()
          }]
        } : t)
      );

      // Check if team is complete
      const updatedTeam = ventureTeams.find(t => t.id === invitation.teamId);
      const totalAssigned = [...(updatedTeam?.members || []), {
        assignedQuantity: invitation.assignedQuantity
      }].reduce((sum, m) => sum + m.assignedQuantity, 0);

      if (totalAssigned >= team.totalQuantity) {
        setVentureTeams(prev =>
          prev.map(t => t.id === invitation.teamId ? { ...t, status: 'confirmed' } : t)
        );
      }
    }

    return true;
  };

  // Vendor rejects invitation
  const rejectInvitation = (invitationId, vendorId) => {
    const invitation = vendorInvitations.find(i => i.id === invitationId);
    if (!invitation || invitation.vendorId !== vendorId) return false;

    setVendorInvitations(prev =>
      prev.map(inv => inv.id === invitationId ? { ...inv, status: 'rejected' } : inv)
    );

    return true;
  };

  // Update vendor progress
  const updateVendorProgress = (teamId, vendorId, progress) => {
    setVentureTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.map(member =>
              member.vendorId === vendorId ? { ...member, progress } : member
            )
          };
        }
        return team;
      })
    );
  };

  // Delete team (Admin only)
  const deleteVentureTeam = (teamId) => {
    setVentureTeams(prev => prev.filter(t => t.id !== teamId));
    setVendorInvitations(prev => prev.filter(i => i.teamId !== teamId));
  };

  // Get invitations for a specific vendor
  const getVendorInvitations = (vendorId) => {
    return vendorInvitations.filter(inv => inv.vendorId === vendorId);
  };

  // Get teams where vendor is a member
  const getVendorTeams = (vendorId) => {
    return ventureTeams.filter(team => 
      team.members.some(member => member.vendorId === vendorId)
    );
  };

  return (
    <VentureContext.Provider
      value={{
        specialOfferRequests,
        ventureTeams,
        vendorInvitations,
        pendingUsers,
        mockVendors,
        addSpecialOfferRequest,
        acceptSpecialOfferRequest,
        rejectSpecialOfferRequest,
        addPendingUser,
        approveUser,
        rejectUser,
        getSuggestedVendors,
        createVentureTeam,
        createStandaloneTeam,
        updateVentureTeam,
        removeVendorFromTeam,
        sendVendorInvitation,
        acceptInvitation,
        rejectInvitation,
        updateVendorProgress,
        deleteVentureTeam,
        getVendorInvitations,
        getVendorTeams
      }}
    >
      {children}
    </VentureContext.Provider>
  );
};
