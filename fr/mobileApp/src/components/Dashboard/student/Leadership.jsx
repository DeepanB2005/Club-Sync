import React, { useState, useEffect, useMemo } from "react";
import { Crown, Edit3, X } from "lucide-react";
import ManageMembers from "./ManageMembers";
import ManageEvents from "./ManageEvents";

const Leadership = ({ user, clubs = [], clubsLoading = false }) => {
  const [editClubId, setEditClubId] = useState(null);
  const [clubForm, setClubForm] = useState({});
  const [savingClub, setSavingClub] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [eventForm, setEventForm] = useState({});
  const [eventSaving, setEventSaving] = useState(false);
  const [clubEvents, setClubEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [deletingMember, setDeletingMember] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState({}); // { [clubId]: 'members' | 'events' | null }

  // Only show clubs where user is leader
  const leaderClubs = useMemo(
    () => (clubs || []).filter(
      club => club.leader && club.leader._id === user?._id
    ),
    [clubs, user?._id]
  );

  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const allEvents = [];
        for (const club of leaderClubs) {
          const res = await fetch(`https://club-events-1.onrender.com/api/events/club/${club._id}`);
          if (res.ok) {
            const data = await res.json();
            allEvents.push(...data);
          }
        }
        setClubEvents(allEvents);
      } catch {
        setClubEvents([]);
      }
      setEventsLoading(false);
    };
    if (leaderClubs.length > 0) fetchEvents();
    else setClubEvents([]);
  }, [leaderClubs]);


  const startEditClub = (club) => {
    setEditClubId(club._id);
    setClubForm({
      name: club.name,
      description: club.description,
      profilePhoto: club.profilePhoto || "",
    });
    setError(null);
  };
  const cancelEditClub = () => {
    setEditClubId(null);
    setClubForm({});
    setError(null);
  };
  const handleClubInput = e => setClubForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleClubPhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setClubForm(f => ({ ...f, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };
  const saveClub = async (clubId) => {
    setSavingClub(true);
    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/clubs/${clubId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clubForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setEditClubId(null);
      setClubForm({});
    } catch (err) {
      setError(err.message);
    }
    setSavingClub(false);
  };

  // --- Manage Events Section Handlers ---
  const startEditEvent = (event) => {
    setEditEventId(event._id);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.slice(0, 10) : "",
      time: event.date ? new Date(event.date).toISOString().slice(11, 16) : "",
      price: event.price || "",
      profilePhoto: event.profilePhoto || "",
    });
  };
  const cancelEditEvent = () => {
    setEditEventId(null);
    setEventForm({});
  };
  const handleEventInput = e => setEventForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleEventPhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEventForm(f => ({ ...f, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };
  const saveEvent = async (eventId, clubId) => {
    setEventSaving(true);
    try {
      let eventDateTime = eventForm.date;
      if (eventForm.time) {
        eventDateTime = `${eventForm.date}T${eventForm.time}:00`;
      }
      const res = await fetch(`https://club-events-1.onrender.com/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          date: eventDateTime,
          price: eventForm.price,
          profilePhoto: eventForm.profilePhoto,
          club: clubId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setClubEvents(prev => prev.map(ev => (ev._id === eventId ? data.event : ev)));
      setEditEventId(null);
      setEventForm({});
    } catch (err) {
      setError(err.message);
    }
    setEventSaving(false);
  };
  const deleteEvent = async (eventId) => {
    setEventSaving(true);
    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setClubEvents(prev => prev.filter(ev => ev._id !== eventId));
    } catch (err) {
      setError(err.message);
    }
    setEventSaving(false);
  };

  const deleteMember = async (clubId, memberId) => {
    setDeletingMember(memberId);
    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/clubs/${clubId}/members/${memberId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
    } catch (err) {
      setError(err.message);
    }
    setDeletingMember(null);
  };

  if (clubsLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-xl font-semibold text-gray-700">Loading your clubs...</span>
        </div>
      </div>
    );

  if (leaderClubs.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <Crown className="h-16 w-16 mx-auto text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Leadership Roles</h2>
          <p className="text-gray-500">You are not currently leading any clubs.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-32">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-300 bg-clip-text text-transparent">
              Leadership Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your clubs and members with ease</p>
        </div>
        <div className="space-y-8">
          {leaderClubs.map(club => (
            <div key={club._id} className=" mb-10">
              <div className="flex gap-4 px-8 pt-6">
                <button
                  className={`px-6 mb-5 py-2 rounded-xl font-bold shadow  ${activeSection?.[club._id] !== 'events' && activeSection?.[club._id] !== 'members' ? 'bg-gradient-to-r from-green-200 to-yellow-100 text-blue-700' : 'bg-white text-gray-700 border border-blue-200 dark:bg-purple-950 dark:text-yellow-300'}`}
                  onClick={() => setActiveSection(s => ({ ...s, [club._id]: 'members' }))}
                >
                  Manage Members
                </button>
                <button
                  className={`px-6 mb-5 py-2 rounded-xl font-bold shadow ${activeSection?.[club._id] === 'events' ? 'bg-green-100 text-green-700' : 'bg-gradient-to-r from-green-200 to-yellow-100 text-gray-700 border border-green-200'}`}
                  onClick={() => setActiveSection(s => ({ ...s, [club._id]: 'events' }))}
                >
                  Manage Events
                </button>
              </div>
              {editClubId === club._id ? (
                <form
                  className="p-8 flex flex-col gap-6"
                  onSubmit={e => {
                    e.preventDefault();
                    saveClub(club._id);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleClubPhoto}
                      className="mb-2"
                    />
                    {clubForm.profilePhoto ? (
                      <img src={clubForm.profilePhoto} alt="Club" className="w-20 h-20 object-cover rounded-full border-4 border-purple-200" />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-100 text-3xl font-bold border-4 border-purple-200">
                        {clubForm.name?.charAt(0) || club.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={clubForm.name || ""}
                    onChange={handleClubInput}
                    placeholder="Club Name"
                    className="px-3 py-2 rounded-lg border border-purple-200"
                    required
                  />
                  <textarea
                    name="description"
                    value={clubForm.description || ""}
                    onChange={handleClubInput}
                    placeholder="Description"
                    className="px-3 py-2 rounded-lg border border-purple-200"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                      disabled={savingClub}
                    >
                      {savingClub ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500"
                      onClick={cancelEditClub}
                      disabled={savingClub}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                
                (!activeSection[club._id] || activeSection[club._id] === null) && (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-3xl shadow-lg shadow-gray-500 text-white font-ft flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {club.profilePhoto ? (
                        <img src={club.profilePhoto} alt={club.name}
                          className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg" />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 text-3xl font-bold border-4 border-white">
                          {club.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <h2 className="text-3xl bg-gradient-to-b from-yellow-300 to-green-200 text-transparent bg-clip-text font-bold mb-2">{club.name}</h2>
                        <p className="text-purple-100 text-lg">{club.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Crown className="h-4 w-4" />
                          <span className="text-sm">Led by {club.leader?.username || club.leader?.email}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors"
                      onClick={() => startEditClub(club)}
                    >
                      <Edit3 className="h-4 w-4" />Edit Club
                    </button>
                  </div>
                )
              )}
              <div className="p-8">
                {activeSection[club._id] === "events" && (
                  <div>
                    <button
                      className="mb-4 flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold"
                      onClick={() => setActiveSection(s => ({ ...s, [club._id]: null }))}
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" /> Close
                    </button>
                    <ManageEvents
                      leaderClubs={[club]}
                      clubEvents={clubEvents}
                      eventsLoading={eventsLoading}
                      editEventId={editEventId}
                      eventForm={eventForm}
                      eventSaving={eventSaving}
                      startEditEvent={startEditEvent}
                      cancelEditEvent={cancelEditEvent}
                      handleEventInput={handleEventInput}
                      handleEventPhoto={handleEventPhoto}
                      saveEvent={saveEvent}
                      deleteEvent={deleteEvent}
                      error={error}
                    />
                  </div>
                )}
                {activeSection[club._id] === "members" && (
                  <div>
                    <button
                      className="mb-4 flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold"
                      onClick={() => setActiveSection(s => ({ ...s, [club._id]: null }))}
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" /> Close
                    </button>
                    <ManageMembers
                      leaderClubs={[club]}
                      deletingMember={deletingMember}
                      deleteMember={deleteMember}
                      error={error}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leadership;