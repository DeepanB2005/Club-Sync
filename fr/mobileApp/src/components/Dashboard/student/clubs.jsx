import React, { useState, useEffect } from 'react';

function Clubs({ clubs: clubsProp, loading: loadingProp, error: errorProp, user }) {
  console.log('User in Clubs:', user);

  const [clubs, setClubs] = useState(clubsProp || []);
  const [loading, setLoading] = useState(loadingProp ?? true);
  const [error, setError] = useState(errorProp || null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joinStatus, setJoinStatus] = useState({}); // { [clubId]: 'pending' | 'joined' | 'error' | null }
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    if (clubsProp) setClubs(clubsProp);
    if (loadingProp !== undefined) setLoading(loadingProp);
    if (errorProp) setError(errorProp);
  }, [clubsProp, loadingProp, errorProp]);

  const handleJoinClub = async (club) => {
    if (!user) {
      setJoinStatus(s => ({ ...s, [club._id]: 'error' }));
      setRequestMessage('You must be logged in to join a club.');
      return;
    }
    setJoinStatus(s => ({ ...s, [club._id]: 'pending' }));
    setRequestMessage('');
    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/clubs/${club._id}/join-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinStatus(s => ({ ...s, [club._id]: 'error' }));
        setRequestMessage(data.error || 'Failed to send join request.');
      } else {
        setJoinStatus(s => ({ ...s, [club._id]: 'requested' }));
        setRequestMessage('Join request sent to club leader!');
      }
    } catch (err) {
      setJoinStatus(s => ({ ...s, [club._id]: 'error' }));
      setRequestMessage('Failed to send join request.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-ft p-6 bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-200">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent mb-12 tracking-tight drop-shadow-lg">
        Explore Clubs
      </h1>
      {loading ? (
        <div className="text-lg text-gray-600">Loading clubs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {clubs.map(club => (
            <div
              key={club._id}
              className="relative bg-white rounded-3xl shadow-2xl p-7 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-4 border-transparent hover:border-blue-300 group"
              onClick={() => setSelectedClub(club)}
            >
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-400 to-pink-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                {club.members?.length || 0} Members
              </div>
              {club.profilePhoto ? (
                <img
                  src={club.profilePhoto}
                  alt={club.name}
                  className="w-28 h-28 object-cover rounded-full mb-5 border-4 border-pink-200 shadow-lg group-hover:border-[Math.ran] transition-all"
                />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-pink-200 mb-5 text-4xl text-white font-extrabold border-4 border-pink-200 shadow-lg">
                  {club.name?.charAt(0) || "?"}
                </div>
              )}
              <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center drop-shadow">{club.name}</h2>
              <p className="text-gray-600 text-center mb-4 line-clamp-3 italic">{club.description}</p>
              {club.leader && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gradient-to-r from-yellow-300 to-pink-300 px-2 py-1 rounded-full font-semibold text-gray-700 shadow">
                    Leader
                  </span>
                  <span className="font-medium text-blue-600">
                    {club.leader.username || club.leader.email || club.leader._id}
                  </span>
                </div>
              )}
              
              <button className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-xl font-bold shadow-lg hover:from-pink-400 hover:to-blue-400 transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full relative border-8 border-blue-200 animate-fade-in">
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-red-500 text-4xl font-bold"
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
                  className="w-36 h-36 object-cover rounded-full mb-6 border-4 border-pink-300 shadow-xl"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-pink-200 mb-6 text-5xl text-white font-extrabold border-4 border-pink-300 shadow-xl">
                  {selectedClub.name?.charAt(0) || "?"}
                </div>
              )}
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-pink-400 text-transparent bg-clip-text mb-3 drop-shadow-lg">{selectedClub.name}</h2>
              <p className="text-gray-700 text-center mb-4 text-lg italic">{selectedClub.description}</p>
              <div className="flex flex-wrap text-md text-gray-600 mb-4 w-full justify-center items-center gap-4">
                <span>
                  <span className="font-bold text-green-500">Leader:</span>{" "}
                  {selectedClub.leader?.username || selectedClub.leader?.email || selectedClub.leader?._id}
                </span>
                <span className="font-bold text-blue-400">|</span>
                <span className="font-bold text-purple-500">Active Members:</span> {selectedClub.members?.length || 0}
              </div>
              <button
                className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-xl font-bold shadow-lg hover:from-pink-400 hover:to-blue-400 transition-all"
                onClick={() => handleJoinClub(selectedClub)}
                disabled={joinStatus[selectedClub._id] === 'requested' || joinStatus[selectedClub._id] === 'pending'}
              >
                {joinStatus[selectedClub._id] === 'requested'
                  ? "Request Sent"
                  : joinStatus[selectedClub._id] === 'pending'
                  ? "Requesting..."
                  : "Join Club"}
              </button>
              {joinStatus[selectedClub._id] === 'error' && (
                <div className="text-red-500 text-xs mt-2">{requestMessage}</div>
              )}
              {joinStatus[selectedClub._id] === 'requested' && (
                <div className="text-green-600 text-xs mt-2">{requestMessage}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clubs;