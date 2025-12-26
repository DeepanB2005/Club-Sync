import React, { useState, useEffect } from 'react';

function EventsShowcase() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events data from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://club-events-1.onrender.com/api/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Sort events by date and show only upcoming events (limit to 8 for home page)
        const upcomingEvents = data
          .filter(event => new Date(event.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 8);
        setEvents(upcomingEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Dynamic event type assignment based on event name/description
  const getEventType = (event) => {
    const title = event.title?.toLowerCase() || '';
    const desc = event.description?.toLowerCase() || '';
    
    if (title.includes('workshop') || title.includes('seminar') || title.includes('training') || desc.includes('learn') || desc.includes('skill')) {
      return 'Workshop';
    } else if (title.includes('party') || title.includes('celebration') || title.includes('festival') || desc.includes('celebrate') || desc.includes('fun')) {
      return 'Social';
    } else if (title.includes('competition') || title.includes('contest') || title.includes('tournament') || desc.includes('compete') || desc.includes('win')) {
      return 'Competition';
    } else if (title.includes('meeting') || title.includes('discussion') || title.includes('conference') || desc.includes('discuss') || desc.includes('meet')) {
      return 'Meeting';
    } else {
      return 'General';
    }
  };

  const typeColors = {
    Workshop: "from-blue-500 to-indigo-500",
    Social: "from-pink-500 to-rose-500",
    Competition: "from-orange-500 to-red-500",
    Meeting: "from-purple-500 to-violet-500",
    General: "from-green-500 to-emerald-500"
  };

  const typeIcons = {
    Workshop: "🎓",
    Social: "🎉",
    Competition: "🏆",
    Meeting: "👥",
    General: "📅"
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on exciting events happening in your community
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading exciting events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg mb-4">Failed to load events</p>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Events State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">No upcoming events</p>
            <p className="text-gray-500">Check back later for exciting events!</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {events.map((event) => {
              const eventType = getEventType(event);
              return (
                <div
                  key={event._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Event Type Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${typeColors[eventType]} shadow-lg z-10`}>
                    {eventType}
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg z-10">
                    <div className="text-xs font-semibold text-gray-600">
                      {formatDate(event.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(event.date)}
                    </div>
                  </div>

                  <div className="p-6 pt-16">
                    {/* Event Avatar */}
                    <div className="flex justify-center mb-6">
                      {event.profilePhoto ? (
                        <img
                          src={event.profilePhoto}
                          alt={event.title}
                          className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 group-hover:border-indigo-200 transition-colors"
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typeColors[eventType]} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                          {typeIcons[eventType]}
                        </div>
                      )}
                    </div>

                    {/* Event Info */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center justify-center gap-1">
                        🏠 <span className="truncate">{event.club?.name || 'Club Event'}</span>
                      </div>
                      {event.price && (
                        <div className="flex items-center justify-center gap-1">
                          💰 <span>₹{event.price}</span>
                        </div>
                      )}
                    </div>

                    {/* Join Button */}
                    <button className={`w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r ${typeColors[eventType]} hover:scale-105 transition-transform shadow-md hover:shadow-lg`}>
                      Join Event
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[eventType]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        {!loading && !error && events.length > 0 && (
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to see more events?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore all upcoming events and never miss out on great opportunities
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg">
                View All Events
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsShowcase;