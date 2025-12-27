import React, { useState, useEffect } from 'react';

function Createclub() {
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [clubLeader, setClubLeader] = useState('');

  useEffect(() => {
    fetch(`https://club-events-1.onrender.com/api/users`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!clubName.trim()) {
      setErrors({ clubName: 'Club name is required' });
      return;
    }
    if (!clubLeader) {
      setErrors({ clubLeader: 'Please select a leader' });
      return;
    }
    if (!clubDescription.trim()) {
      setErrors({ clubDescription: 'Description is required' });
      return;
    }

    const leaderUser = users.find(u => u.username === clubLeader);
    const data = {
      name: clubName,
      description: clubDescription,
      leader: leaderUser?._id, 
      profilePhoto: previewImage,
      members: [leaderUser?._id].filter(Boolean)
    };

    try {
      const res = await fetch(`https://club-events-1.onrender.com/api/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json();
        setErrors({ submit: errData.error || 'Failed to create club' });
      } else {
        setClubName('');
        setClubDescription('');
        setClubLeader('');
        setPreviewImage(null);
        alert('Club created successfully!');
      }
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 sm:px-6 lg:px-10 font-ft">
      <div className="flex flex-col items-center text-center sm:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#4361ee] to-[#f72585] rounded-full mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl sm:ml-5 font-bold bg-gradient-to-r from-[#4361ee] to-[#f72585] bg-clip-text text-transparent mb-2">
          Create Your Club
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 sm:ml-5 text-sm sm:text-base text-center sm:text-left">
        Build a community around your passion
      </p>

      <div className="mt-6 w-full max-w-3xl shadow-2xl dark:text-white rounded-2xl bg-gradient-to-r from-blue-200 to-violet-200 dark:bg-gradient-to-t dark:from-gray-600 dark:to-yellow-800 p-5 sm:p-8 max-h-[75vh] overflow-y-auto">
        <form className="flex flex-col md:flex-row gap-8 dark:text-white" onSubmit={handleSubmit}>
          <div className="flex-1">
            <div className="w-[80px] mx-auto md:mx-0">
              <label htmlFor="profilePhoto" className="cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#4361ee] to-[#f72585] p-1 shadow-lg mx-auto md:ml-20">
                  <input
                    type="file"
                    id="profilePhoto"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setPreviewImage(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="w-full h-full rounded-full bg-violet-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center md:text-left md:ml-20">Click to upload</p>

            <label className="block text-gray-700 text-lg font-bold mb-2 mt-5 dark:text-white">
              Club Name
            </label>
            <input
              className="shadow appearance-none border w-full max-w-xs rounded-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="clubName"
              type="text"
              placeholder="Enter club name"
              value={clubName}
              onChange={e => setClubName(e.target.value)}
            />
            {errors.clubName && <p className="text-red-500 text-xs mt-1">{errors.clubName}</p>}

            <label className="block text-gray-700 text-lg font-bold mt-5 mb-2 dark:text-white">
              Select Leader
            </label>
            <select
              className="appearance-none border rounded-2xl h-10 dark:text-gray-600 bg-gray-100 w-full max-w-xs p-1 leading-tight shadow-md pl-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={clubLeader}
              onChange={e => setClubLeader(e.target.value)}
            >
              <option value="">
                {loading ? "Loading users..." : error ? "Error loading users" : "Select a leader"}
              </option>
              {!loading && !error && users.map(user => (
                <option key={user._id} value={user.username} className="text-gray-700">
                  {user.username} - {user.email} ({user.role})
                </option>
              ))}
            </select>
            {errors.clubLeader && <p className="text-red-500 text-xs mt-1">{errors.clubLeader}</p>}

            {error && (
              <p className="text-red-500 text-xs flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Failed to load users: {error}
              </p>
            )}

            {errors.submit && (
              <p className="text-red-500 text-xs flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.submit}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex-1">
            <p className="font-semibold mb-1">Club Description</p>
            <div className="h-40 sm:h-60 mt-2 bg-gray-100 drop-shadow-md border-gray-900 rounded-3xl">
              <textarea
                className="w-full h-full p-3 rounded-3xl dark:text-gray-600 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter club description"
                value={clubDescription}
                onChange={e => setClubDescription(e.target.value)}
              ></textarea>
            </div>
            {errors.clubDescription && <p className="text-red-500 text-xs mt-1">{errors.clubDescription}</p>}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-5">
              Provide a brief description of your club's purpose and activities
            </p>
          </div>
        </form>
        <div className="w-full h-[2px] bg-gradient-to-r from-[#4361ee] to-[#f72585] mt-5 mb-5"></div>
        <div className="flex justify-center items-center mt-3 mb-1">
          <button
            className="bg-gradient-to-r from-[#4361ee] to-[#f72585] text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300"
            type="submit"
            onClick={handleSubmit}
          >
            Create Club
          </button>
        </div>
      </div>
    </div>
  );
}

export default Createclub;