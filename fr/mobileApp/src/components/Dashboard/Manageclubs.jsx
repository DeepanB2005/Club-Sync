import React, { useState, useEffect } from 'react';

function ManageClubs({ clubs: clubsProp, loading: loadingProp, error: errorProp, setClubs: setClubsProp }) {
  const [clubs, setClubs] = useState(clubsProp || []);
  const [loading, setLoading] = useState(loadingProp ?? true);
  const [error, setError] = useState(errorProp || null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (clubsProp) setClubs(clubsProp);
    if (loadingProp !== undefined) setLoading(loadingProp);
    if (errorProp) setError(errorProp);
  }, [clubsProp, loadingProp, errorProp]);

  useEffect(() => {
    fetch(`https://club-events-1.onrender.com/api/users`)
      .then(res => res.json())
      .then(data => setAllUsers(data))
      .catch(() => setAllUsers([]));
  }, []);

 const handleDeleteClub = async (clubId) => {
    if (!window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) return;

    setDeleting(true);
    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/clubs/${clubId}`, {
        method: 'DELETE',
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || 'Server returned non-JSON response.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete club');
      }

      setClubs(prev => prev.filter(club => club._id !== clubId));
      if (setClubsProp) setClubsProp(prev => prev.filter(club => club._id !== clubId));
      setSelectedClub(null);
      alert('Club deleted successfully!');
    } catch (err) {
      alert('Error deleting club: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

const handleChangeLeader = async (clubId, newLeaderId) => {
  try {
    console.log('Changing leader for club:', clubId, 'to user:', newLeaderId); // Debug log

    const url = `https://club-events-1.onrender.com/api/clubs/${clubId}`;
    console.log('Making PATCH request to:', url); // Debug log

    const res = await fetch(url, { 
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leader: newLeaderId }),
    });

    console.log('Response status:', res.status); // Debug log
    console.log('Response headers:', res.headers); // Debug log

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(data.error || `HTTP ${res.status}: Failed to change leader`);
    }

    const responseData = await res.json();
    console.log('Success response:', responseData);


    setClubs(prev =>
      prev.map(club =>
        club._id === clubId
          ? { ...club, leader: responseData.club.leader }
          : club
      )
    );

    if (setClubsProp) {
      setClubsProp(prev =>
        prev.map(club =>
          club._id === clubId
            ? { ...club, leader: responseData.club.leader }
            : club
        )
      );
    }

    setSelectedClub(prev =>
      prev
        ? { ...prev, leader: responseData.club.leader }
        : prev
    );

    alert('Leader changed successfully!');
  } catch (err) {
    console.error('Error changing leader:', err);
    alert('Error changing leader: ' + err.message);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center font-ft p-6 ">
      <h1 className="text-3xl font-bold bg-gradient-to-t from-yellow-500 to-red-500 bg-clip-text text-transparent mb-8">
        Manage Clubs
      </h1>
      {loading ? (
        <div className="text-lg text-gray-600">Loading clubs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
          {clubs.map(club => (
            <button
              key={club._id}
              className="bg-gradient-to-r from-red-200 via-gray-200 to-red-300 rounded-2xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform focus:outline-none"
              onClick={() => setSelectedClub(club)}
            >
              {club.profilePhoto ? (
                <img
                  src={club.profilePhoto}
                  alt={club.name}
                  className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-blue-200"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full  bg-blue-200 mb-4 text-3xl text-white font-bold">
                  {club.name?.charAt(0) || "?"}
                </div>
              )}
              <h2 className="text-xl font-semibold text-blue-700 mb-2 text-center">{club.name}</h2>
              <p className="text-gray-600 text-center mb-2 line-clamp-3">{club.description}</p>
              {club.leader && (
                <p className="text-sm text-gray-500 mb-1">
                  Leader: <span className="font-medium">
                    {club.leader.username || club.leader.email || club.leader._id}
                  </span>
                </p>
              )}
              <p className="text-xs text-gray-400">Members: {club.members?.length || 0}</p>
            </button>
          ))}
        </div>
      )}

      {selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-3xl"
              onClick={() => setSelectedClub(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {selectedClub.profilePhoto ? (
                <img
                  src={selectedClub.profilePhoto}
                  alt={selectedClub.name}
                  className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-blue-200"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-200 mb-4 text-4xl text-white font-bold">
                  {selectedClub.name?.charAt(0) || "?"}
                </div>
              )}
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 text-transparent bg-clip-text mb-2">{selectedClub.name}</h2>
              <p className="text-gray-700 text-justify mb-4">{selectedClub.description}</p>
              <div className="flex flex-wrap text-md text-gray-600 mb-2 w-full justify-between items-center">
                <span>
                  <span className="font-bold text-green-500">Leader:</span> {selectedClub.leader?.username || selectedClub.leader?.email || selectedClub.leader?._id}
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor="change-leader" className="text-blue-500 font-semibold">Change Leader:</label>
                  <select
                    id="change-leader"
                    className="rounded-lg border border-blue-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={selectedClub.leader?._id || ""}
                    onChange={e => handleChangeLeader(selectedClub._id, e.target.value)}
                  >
                    <option value="" disabled>Select user</option>
                    {allUsers.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.username || user.email || user._id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedClub.members && selectedClub.members.length > 0 && (
                <div className="w-full mt-2">
                  <span className="font-semibold text-gray-700">Member List:</span>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedClub.members.map(member =>
                      <li key={member._id || member}>{member.username || member.email || member._id}</li>
                    )}
                  </ul>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-4">Created: {new Date(selectedClub.createdAt).toLocaleString()}</p>
              

              <div className="mt-3 flex gap-3">
                
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleDeleteClub(selectedClub._id)}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Club'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageClubs;