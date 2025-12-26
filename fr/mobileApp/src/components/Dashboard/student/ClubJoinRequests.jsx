import React, { useEffect, useState } from 'react';
import { UserPlus, Clock, CheckCircle, XCircle, Mail, Phone, Calendar, User } from 'lucide-react';

function ClubJoinRequests({ user }) {
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const getCurrentUser = () => {
    if (user && user._id) return user;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        return null;
      }
    }
    return null;
  };

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser?._id) {
      setLoading(false);
      setError('User not found. Please log in again.');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data for user:', currentUser._id);
        
        try {
          console.log('Attempting to fetch via leader route...');
          const leaderResponse = await fetch(`https://club-events-1.onrender.com/api/join-requests/leader/${currentUser._id}`);
          
          if (leaderResponse.ok) {
            const leaderRequests = await leaderResponse.json();
            console.log('Leader requests:', leaderRequests);
            
            if (leaderRequests.length > 0) {
              setRequests(leaderRequests);
              
              // Extract unique clubs from the requests
              const uniqueClubs = leaderRequests.reduce((acc, req) => {
                if (req.club && !acc.find(c => c._id === req.club._id)) {
                  acc.push(req.club);
                }
                return acc;
              }, []);
              
              setClubs(uniqueClubs);
              setLoading(false);
              return;
            }
          }
        } catch (leaderError) {
          console.log('Leader route failed, trying individual club method:', leaderError);
        }
        
        // Method 2: Fallback - Get clubs first, then requests for each club
        console.log('Fetching clubs first...');
        const clubsResponse = await fetch(`https://club-events-1.onrender.com/api/clubs`);
        if (!clubsResponse.ok) {
          throw new Error(`Failed to fetch clubs: ${clubsResponse.status}`);
        }
        
        const clubsData = await clubsResponse.json();
        console.log('All clubs:', clubsData);
        
        // Filter clubs where current user is the leader
        const leaderClubs = clubsData.filter(club => {
          const leaderId = typeof club.leader === 'object' ? club.leader._id : club.leader;
          return leaderId === currentUser._id;
        });
        
        console.log('Leader clubs found:', leaderClubs);
        setClubs(leaderClubs);
        
        if (leaderClubs.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch join requests for each club
        const allRequests = [];
        
        for (const club of leaderClubs) {
          try {
            console.log(`Fetching requests for club: ${club._id}`);
            const response = await fetch(`https://club-events-1.onrender.com/api/join-requests/club/${club._id}`);
            
            if (response.ok) {
              const clubRequests = await response.json();
              console.log(`Requests for ${club.name}:`, clubRequests);
              
              // Add club information to each request
              const requestsWithClubInfo = clubRequests.map(req => ({
                ...req,
                clubName: club.name,
                clubId: club._id
              }));
              
              allRequests.push(...requestsWithClubInfo);
            } else {
              console.error(`Failed to fetch requests for club ${club.name}: ${response.status}`);
            }
          } catch (err) {
            console.error(`Error fetching requests for club ${club.name}:`, err);
          }
        }

        // Sort by creation date (newest first)
        allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        console.log('All join requests:', allRequests);
        setRequests(allRequests);
        
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleAction = async (requestId, status, clubId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    
    try {
      console.log(`Updating request ${requestId} to ${status}`);
      
      const response = await fetch(`https://club-events-1.onrender.com/api/join-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${status} request`);
      }

      const data = await response.json();
      console.log(`Request ${status} response:`, data);

      // Update the request status in local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status } : req
        )
      );

      console.log(`Request ${status} successfully!`);
      
    } catch (err) {
      console.error(`Error ${status}ing request:`, err);
      setError(`Failed to ${status} request: ${err.message}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  // Show error if user is not logged in
  if (!currentUser?._id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You must be logged in as a club leader to view join requests.</p>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading join requests...</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join Requests</h1>
          </div>
          <p className="text-gray-600">
            Manage membership requests for your clubs
          </p>
          {currentUser && (
            <div className="mt-2 text-sm text-gray-500">
              Logged in as: {currentUser.username || currentUser.email}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No clubs managed */}
        {clubs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Clubs Found</h3>
            <p className="text-gray-600 mb-4">You are not a leader of any clubs.</p>
            <p className="text-gray-500 text-sm">Create a club to start receiving join requests.</p>
          </div>
        ) : requests.length === 0 ? (
          // No requests for managed clubs
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Join Requests</h3>
            <p className="text-gray-600 mb-4">
              No requests found for your clubs.
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              Managing {clubs.length} club{clubs.length !== 1 ? 's' : ''}: {clubs.map(c => c.name).join(', ')}
            </div>
          </div>
        ) : (
          // Show requests
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  {requests.length} total request{requests.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  {requests.filter(r => r.status === 'pending').length} pending
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {requests.filter(r => r.status === 'approved').length} approved
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  {requests.filter(r => r.status === 'rejected').length} rejected
                </span>
              </div>
            </div>

            {/* Requests List */}
            {requests.map(req => (
              <div key={req._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* User Information */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-lg">
                {(req.user?.username || req.user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
                      </div>
                    </div>


                    <div className="flex flex-col items-end space-y-3">

                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                        req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : req.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {req.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                        {req.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
                        {req.status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>

                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center ${
                              actionLoading[req._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleAction(req._id, 'approved', req.clubId)}
                            disabled={actionLoading[req._id]}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {actionLoading[req._id] ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center ${
                              actionLoading[req._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleAction(req._id, 'rejected', req.clubId)}
                            disabled={actionLoading[req._id]}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {actionLoading[req._id] ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubJoinRequests;
