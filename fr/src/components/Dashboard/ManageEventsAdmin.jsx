import React, { useState } from "react";
import { Trash2, CalendarDays } from "lucide-react";

const ManageEventsAdmin = ({ events = [], loading = false, error, setEvents }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (eventId) => {
    if (!eventId) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    setDeletingId(eventId);
    setActionError("");

    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/events/${eventId}`, {
        method: "DELETE",
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // ignore non-JSON bodies
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      if (typeof setEvents === "function") {
        setEvents((prev) => Array.isArray(prev) ? prev.filter((ev) => ev._id !== eventId) : []);
      }
    } catch (err) {
      setActionError(err.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 sm:p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">Manage Events</h1>
            <p className="text-sm text-gray-500">View and delete any event in the system</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading events...</div>
        ) : !events || events.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No events available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-md border border-purple-100 p-5 flex flex-col items-center text-center"
              >
                {event.profilePhoto ? (
                  <img
                    src={event.profilePhoto}
                    alt={event.title}
                    className="w-20 h-20 object-cover rounded-full border-4 border-purple-200 mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-pink-200 text-2xl font-bold text-white border-4 border-purple-200 mb-3">
                    {event.title?.charAt(0) || "?"}
                  </div>
                )}
                <h2 className="text-lg font-semibold text-purple-800 mb-1 line-clamp-2">{event.title}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">{event.description}</p>
                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <div>
                    <span className="font-semibold text-purple-600">Club:</span>{" "}
                    {event.club?.name || "Unknown"}
                  </div>
                  <div>
                    <span className="font-semibold text-blue-600">Date:</span>{" "}
                    {event.date ? new Date(event.date).toLocaleString() : "N/A"}
                  </div>
                  {event.price && (
                    <div>
                      <span className="font-semibold text-yellow-600">Price:</span>{" "}
                      ₹{event.price}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(event._id)}
                  disabled={deletingId === event._id}
                  className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === event._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventsAdmin;
