import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar.jsx';
import Createclub from '../components/Dashboard/createclub.jsx';
import ManageClubs from '../components/Dashboard/Manageclubs.jsx'; 
import Manageusers from '../components/Dashboard/Manageusers.jsx';
import Leadership from '../components/Dashboard/student/Leadership.jsx';
import Clubs from '../components/Dashboard/student/clubs.jsx';
import Events from '../components/Dashboard/student/Events.jsx';
import ClubJoinRequests from '../components/Dashboard/student/ClubJoinRequests';
import DashboardGreetings from '../components/Dashboard/dashboard.jsx';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [eventsError, setEventsError] = useState(null);

  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Helper function to get current user
  const getCurrentUser = () => {
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

  useEffect(() => {
    // Load cached data from sessionStorage, if available
    const cachedClubsStr = sessionStorage.getItem('clubs');
    const cachedUsersStr = sessionStorage.getItem('users');
    const cachedEventsStr = sessionStorage.getItem('events');

    let hasClubsCache = false;
    let hasUsersCache = false;
    let hasEventsCache = false;

    if (cachedClubsStr) {
      try {
        const cachedClubs = JSON.parse(cachedClubsStr);
        if (Array.isArray(cachedClubs)) {
          setClubs(cachedClubs);
          setClubsLoading(false);
          hasClubsCache = true;
        }
      } catch {
        sessionStorage.removeItem('clubs');
      }
    }

    if (cachedUsersStr) {
      try {
        const cachedUsers = JSON.parse(cachedUsersStr);
        if (Array.isArray(cachedUsers)) {
          setUsers(cachedUsers);
          setUsersLoading(false);
          hasUsersCache = true;
        }
      } catch {
        sessionStorage.removeItem('users');
      }
    }

    if (cachedEventsStr) {
      try {
        const cachedEvents = JSON.parse(cachedEventsStr);
        if (Array.isArray(cachedEvents)) {
          setEvents(cachedEvents);
          setEventsLoading(false);
          hasEventsCache = true;
        }
      } catch {
        sessionStorage.removeItem('events');
      }
    }

    // Fetch latest data from API (stale-while-revalidate style)

    if (!hasClubsCache) setClubsLoading(true);
    fetch(`https://club-events-1.onrender.com/api/clubs`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clubs');
        return res.json();
      })
      .then(data => {
        setClubs(data);
        setClubsLoading(false);
      })
      .catch(err => {
        setClubsError(err.message);
        if (!hasClubsCache) setClubsLoading(false);
      });

    if (!hasUsersCache) setUsersLoading(true);
    fetch(`https://club-events-1.onrender.com/api/users`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setUsersLoading(false);
      })
      .catch(err => {
        setUsersError(err.message);
        if (!hasUsersCache) setUsersLoading(false);
      });

    if (!hasEventsCache) setEventsLoading(true);
    fetch(`https://club-events-1.onrender.com/api/events`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setEventsLoading(false);
      })
      .catch(err => {
        setEventsError(err.message);
        if (!hasEventsCache) setEventsLoading(false);
      });
  }, []);

  // Keep sessionStorage in sync when data changes
  useEffect(() => {
    try {
      sessionStorage.setItem('clubs', JSON.stringify(clubs));
    } catch {
      // ignore quota / serialisation errors
    }
  }, [clubs]);

  useEffect(() => {
    try {
      sessionStorage.setItem('users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      sessionStorage.setItem('events', JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  const handleEventCreated = (newEvent) => {
    if (!newEvent) return;
    setEvents(prev => Array.isArray(prev) ? [...prev, newEvent] : [newEvent]);
  };

  const renderContent = () => {
    const currentUser = getCurrentUser();
    const userObj = users.find(u => u._id === (currentUser && currentUser._id)) || currentUser;

    switch (activeMenu) {

      case 'dashboard':
        return <DashboardGreetings/>

      case 'create-clubs':
        return <Createclub />;
      
      case 'events':
        return (
          <Events
            user={userObj}
            clubs={clubs}
            clubsLoading={clubsLoading}
            events={events}
            eventsLoading={eventsLoading}
            eventsError={eventsError}
            onEventCreated={handleEventCreated}
          />
        );
      
      case 'manage-clubs':
        return (
          <ManageClubs
            clubs={clubs}
            loading={clubsLoading}
            error={clubsError}
            setClubs={setClubs}
          />
        );
      
      case 'manage-users':
        return (
          <Manageusers
            users={users}
            clubs={clubs}
            loading={usersLoading || clubsLoading}
            error={usersError || clubsError}
          />
        );
      
      case 'leadership':
        return (
          <Leadership
            user={userObj}
            clubs={clubs}
            clubsLoading={clubsLoading}
            events={events}
            eventsLoading={eventsLoading}
          />
        );
      
      case 'clubs':
        return (
          <Clubs
            user={currentUser}
            clubs={clubs}
            loading={clubsLoading}
            error={clubsError}
            setClubs={setClubs}
          />
        );
      
      case 'manage-join-requests':
      case 'join-requests':
        return <ClubJoinRequests user={userObj} />;
      
        default:
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Dashboard
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {currentUser ? `Hello, ${currentUser.username || currentUser.email}!` : 'Please log in to continue'}
                </p>
                
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                      {clubsLoading ? '...' : clubs.length}
                    </div>
                    <div className="text-gray-600">Total Clubs</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-green-600">
                      {usersLoading ? '...' : users.length}
                    </div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">
                      {clubsLoading ? '...' : clubs.reduce((sum, club) => sum + (club.members?.length || 0), 0)}
                    </div>
                    <div className="text-gray-600">Total Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-200 to-purple-100 dark:bg-gradient-to-r dark:from-black dark:to-yellow-950">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 lg:hidden bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
      >
        ☰
      </button>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
