import React from "react";
import { CalendarDays, X, Trash2 } from "lucide-react";

const ManageEvents = ({
  leaderClubs,
  clubEvents,
  eventsLoading,
  editEventId,
  eventForm,
  eventSaving,
  startEditEvent,
  cancelEditEvent,
  handleEventInput,
  handleEventPhoto,
  saveEvent,
  deleteEvent,
  error,
}) => (
  <div className=" px-2">
    <div className="max-w-3xl mx-auto">

      {error && (
        <div className=" bg-red-50 border border-red-200 rounded-xl p- flex items-center gap-3">
          <X className="h-5 w-5 text-red-500" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}
      {leaderClubs.map(club => (
        <div key={club._id} className="">
          <div className="flex items-center gap-4 mb-2">
            
            <div>
              <h3 className="text-xl font-bold text-green-700">{club.name}</h3>
            </div>
          </div>
          {eventsLoading ? (
            <div className="text-lg text-gray-500">Loading events...</div>
          ) : (
            <div className="grid gap-6">
              {clubEvents.filter(ev => ev.club?._id === club._id).length === 0 ? (
                <div className="text-gray-400 italic">No events for this club.</div>
              ) : (
                clubEvents.filter(ev => ev.club?._id === club._id).map(event => (
                  <div key={event._id} className="bg-gradient-to-r from-purple-300 to-blue-50 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6 p-6 border border-green-200">
                    {editEventId === event._id ? (
                      <form className="flex-1 flex flex-col md:flex-row gap-6 items-center" onSubmit={e => { e.preventDefault(); saveEvent(event._id, club._id); }}>
                        <div className="flex flex-col items-center">
                          <input type="file" accept="image/*" onChange={handleEventPhoto} className="mb-2" />
                          {eventForm.profilePhoto ? (
                            <img src={eventForm.profilePhoto} alt="Event" className="w-20 h-20 object-cover rounded-full border-4 border-green-200" />
                          ) : (
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-green-200 text-2xl text-white font-bold border-4 border-green-200">
                              {eventForm.title?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" name="title" value={eventForm.title || ""} onChange={handleEventInput} placeholder="Event Name" className="px-3 py-2 rounded-lg border border-blue-200" required />
                          <input type="date" name="date" value={eventForm.date || ""} onChange={handleEventInput} className="px-3 py-2 rounded-lg border border-blue-200" required />
                          <input type="time" name="time" value={eventForm.time || ""} onChange={handleEventInput} className="px-3 py-2 rounded-lg border border-blue-200" />
                          <input type="number" name="price" value={eventForm.price || ""} onChange={handleEventInput} placeholder="Price" className="px-3 py-2 rounded-lg border border-blue-200" min="0" />
                          <textarea name="description" value={eventForm.description || ""} onChange={handleEventInput} placeholder="Description" className="px-3 py-2 rounded-lg border border-blue-200 col-span-2" rows={2} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600" disabled={eventSaving}>
                            {eventSaving ? "Saving..." : "Save"}
                          </button>
                          <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500" onClick={cancelEditEvent} disabled={eventSaving}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                        {event.profilePhoto ? (
                          <img src={event.profilePhoto} alt={event.title} className="w-20 h-20 object-cover rounded-full border-4 border-green-200" />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-green-200 text-2xl text-white font-bold border-4 border-green-200">
                            {event.title?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-green-700">{event.title}</h4>
                          <div className="text-gray-600 mb-1">{event.description}</div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                        <div className="flex flex-col gap-2">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600" onClick={() => startEditEvent(event)}>
                            Edit
                          </button>
                          <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 flex items-center gap-1" onClick={() => deleteEvent(event._id)} disabled={eventSaving}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ManageEvents;