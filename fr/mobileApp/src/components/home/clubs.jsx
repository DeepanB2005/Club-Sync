import React, { useState, useEffect } from 'react';

function ClubsShowcase() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://club-events-1.onrender.com/api/clubs`);
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await response.json();
        setClubs(data);
        setError(null);
      }
       catch (err) 
      {
        console.error('Error fetching clubs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const getClubCategory = (club) => {
    const name = club.name?.toLowerCase() || '';
    const desc = club.description?.toLowerCase() || '';
    
    if (name.includes('tech') || name.includes('dev') || name.includes('code') || name.includes('programming') || desc.includes('technology') || desc.includes('programming')) {
      return 'Technology';
    } else if (name.includes('art') || name.includes('photo') || name.includes('design') || name.includes('creative') || desc.includes('art') || desc.includes('creative')) {
      return 'Arts';
    } else if (name.includes('book') || name.includes('read') || name.includes('literature') || name.includes('writing') || desc.includes('book') || desc.includes('literature')) {
      return 'Literature';
    } else if (name.includes('sport') || name.includes('fitness') || name.includes('adventure') || name.includes('outdoor') || desc.includes('sport') || desc.includes('adventure')) {
      return 'Sports';
    } else {
      return 'General';
    }
  };

  const categoryColors = {
    Arts: "from-pink-500 to-rose-500",
    Technology: "from-blue-500 to-cyan-500",
    Literature: "from-purple-500 to-indigo-500",
    Sports: "from-green-500 to-emerald-500",
    General: "from-gray-500 to-slate-500"
  };

  const categoryIcons = {
    Arts: "🎨",
    Technology: "💻",
    Literature: "📚",
    Sports: "🏔️",
    General: "🌟"
  };

  return (
    <div className="py-16 px-4 ">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Join Amazing Clubs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover communities that match your passions and connect with like-minded people
          </p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading amazing clubs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg mb-4">Failed to load clubs</p>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && clubs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <p className="text-gray-600 text-lg">No clubs available yet</p>
            <p className="text-gray-500">Be the first to create a club!</p>
          </div>
        )}

        {!loading && !error && clubs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {clubs.map((club) => {
              const category = getClubCategory(club);
              return (
                <div
                  key={club._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Category Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${categoryColors[category]} shadow-lg`}>
                    {category}
                  </div>

                  <div className="p-6">
                    {/* Club Avatar */}
                    <div className="flex justify-center mb-6">
                      {club.profilePhoto ? (
                        <img
                          src={club.profilePhoto}
                          alt={club.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 group-hover:border-blue-200 transition-colors"
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                          {categoryIcons[category]}
                        </div>
                      )}
                    </div>

                    {/* Club Info */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                      {club.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        👥 {club.members?.length || 0} members
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        👑 {club.leader?.username || club.leader?.email || 'Leader'}
                      </span>
                    </div>

                    <button className={`w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r ${categoryColors[category]} hover:scale-105 transition-transform shadow-md hover:shadow-lg`}>
                      Join Club
                    </button>
                  </div>

                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                </div>
              );
            })}
          </div>
        )}

        
      </div>
    </div>
  );
}

export default ClubsShowcase;