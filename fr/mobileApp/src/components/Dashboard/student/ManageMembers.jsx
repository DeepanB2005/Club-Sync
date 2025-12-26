import React from "react";
import { Users, X, UserMinus } from "lucide-react";

const ManageMembers = ({
  leaderClubs,
  deletingMember,
  deleteMember,
  error,
}) => (
  <div className="py-6 px-2">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Manage Members</h2>
      </div>
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <X className="h-5 w-5 text-red-500" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}
      {leaderClubs.map(club => (
        <div key={club._id} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            {club.profilePhoto ? (
              <img src={club.profilePhoto} alt={club.name} className="w-14 h-14 object-cover rounded-full border-4 border-blue-200" />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-2xl font-bold border-4 border-blue-200">
                {club.name?.charAt(0) || "?"}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-blue-700">{club.name}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {club.members?.length || 0} members
              </span>
            </div>
          </div>
          {club.members && club.members.length > 0 ? (
            <div className="grid gap-4">
              {club.members.map(member => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {(member.username || member.email)?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{member.username || "Unknown User"}</h4>
                      <p className="text-gray-600 text-sm">{member.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMember(club._id, member._id)}
                    disabled={deletingMember === member._id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {deletingMember === member._id
                      ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      : <UserMinus className="h-4 w-4" />}
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h4 className="text-lg font-semibold text-gray-500 mb-1">No Members Yet</h4>
              <p className="text-gray-400">This club is waiting for its first members to join!</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ManageMembers;