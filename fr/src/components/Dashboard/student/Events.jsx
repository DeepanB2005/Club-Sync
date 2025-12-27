import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

function Events({
  user,
  clubs = [],
  clubsLoading = false,
  events = [],
  eventsLoading = false,
  eventsError,
  onEventCreated,
}) {
  const isLeader = clubs.some(
    (club) => club.leader && club.leader._id === user?._id
  );
  const leaderClubs = clubs.filter(
    (club) => club.leader && club.leader._id === user?._id
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    price: "",
    profilePhoto: "",
    club: leaderClubs[0]?._id || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((f) => ({ ...f, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.title || !form.date || !form.club) {
      setError("Event name, date, and club are required.");
      setSaving(false);
      return;
    }

    try {
      let eventDateTime = form.date;
      if (form.time) {
        eventDateTime = `${form.date}T${form.time}:00`;
      }

      const eventBody = {
        title: form.title,
        description: form.description,
        date: eventDateTime,
        time: form.time,
        price: form.price,
        profilePhoto: form.profilePhoto,
        club: form.club,
      };

      const res = await fetch(`https://club-events-1.onrender.com/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");
      setSuccess("Event created successfully!");
      if (data && data.event && typeof onEventCreated === "function") {
        onEventCreated(data.event);
      }
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        price: "",
        profilePhoto: "",
        club: leaderClubs[0]?._id || "",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
        Events
      </h1>

      {isLeader && (
        <div className="mb-8 flex flex-col items-center">
          <button
            className="flex items-center gap-2 px-6 py-3 mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-400 hover:to-green-500 transition-all"
            onClick={() => setShowForm(true)}
          >
            <PlusCircle className="h-6 w-6" />
            Create Event for Your Club
          </button>
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <form
                className="bg-gradient-to-r from-blue-300 to-green-300 rounded-3xl shadow-2xl p-8 max-w-3xl w-full relative border-4 border-blue-200 flex flex-col md:flex-row gap-8"
                onSubmit={handleSubmit}
              >
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create Event</h2>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Club</label>
                    <select
                      name="club"
                      value={form.club}
                      onChange={handleInput}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none"
                      required
                    >
                      {leaderClubs.map((club) => (
                        <option key={club._id} value={club._id}>
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Event Name</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleInput}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4 flex gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleInput}
                        className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={form.time}
                        onChange={handleInput}
                        className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInput}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none"
                      rows={3}
                    />
                  </div>
                  <div className="mb-4 flex gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleInput}
                        className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none"
                        min="0"
                      />
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <label className="block font-semibold mb-1">Profile Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        className="w-full"
                      />
                      {form.profilePhoto && (
                        <img
                          src={form.profilePhoto}
                          alt="Event"
                          className="w-28 h-28 object-cover rounded-full mt-2 border-4 border-blue-200"
                        />
                      )}
                    </div>
                  </div>
                  {error && <div className="text-red-500 mb-2">{error}</div>}
                  {success && <div className="text-green-600 mb-2">{success}</div>}
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-400 hover:to-green-500 transition-all"
                    disabled={saving}
                  >
                    {saving ? "Creating..." : "Create Event"}
                  </button>
                </div>
                <button
                  type="button"
                  className="absolute top-4 right-6 text-gray-500 hover:text-red-500 text-3xl font-bold"
                  onClick={() => setShowForm(false)}
                  aria-label="Close"
                >
                  <X />
                </button>
              </form>
            </div>
          )}
        </div>
      )}


      <div className="w-full max-w-6xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">All Events</h2>
        {eventsError ? (
          <div className="text-lg text-red-500 text-center">{eventsError}</div>
        ) : eventsLoading ? (
          <div className="text-lg text-gray-600 text-center">Loading events...</div>
        ) : !events || events.length === 0 ? (
          <div className="text-lg text-gray-400 text-center">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {events.map(event => (
              <div
                key={event._id}
                className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center border-4 border-blue-100 hover:border-green-300 transition-all"
              >
                {event.profilePhoto ? (
                  
                  <img
                    src={event.profilePhoto}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-green-200 shadow"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-green-200 mb-4 text-3xl text-white font-extrabold border-4 border-green-200 shadow">
                    {event.title?.charAt(0) || "?"}
                  </div>
                )}
                <h3 className="text-xl font-bold text-blue-700 mb-1 text-center">{event.title}</h3>
                <p className="text-gray-600 text-center mb-2 line-clamp-2">{event.description}</p>
                <div className="flex flex-col items-center text-sm text-gray-500 mb-2">
                  <span>
                    <span className="font-semibold text-green-600">Club:</span>{" "}
                    {event.club?.name || "Unknown"}
                  </span>
                  <span>
                    <span className="font-semibold text-blue-600">Date:</span>{" "}
                    {event.date ? new Date(event.date).toLocaleString() : "N/A"}
                  </span>
                  {event.price && (
                    <span>
                      <span className="font-semibold text-yellow-600">Price:</span> ₹{event.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Events;