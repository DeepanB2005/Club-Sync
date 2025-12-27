import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Carousel from './caurosel';

function Hero() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserClick = () => {
    navigate("/Dashboard"); 
  };

  return (
    <section className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-10 px-4 sm:px-8 lg:px-16 pt-28 pb-10">
      <div className="w-full max-w-xl lg:max-w-lg">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-[#4361ee] to-[#f72585] bg-clip-text text-transparent"
        >
          Manage our Campus Clubs With Efficiency
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          ClubWeb is a comprehensive solution for managing memberships, events, finances, and communications - all in one powerful platform.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {user ? (
            <button
              className="px-6 py-2 shadow-md shadow-gray-500 text-white text-base sm:text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105"
              onClick={handleUserClick}
            >
              {user.username || user.email}
            </button>
          ) : (
            <button className="px-6 py-2 shadow-md shadow-gray-500 text-white text-base sm:text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105">
              <Link to="/Login">Get Started</Link>
            </button>
          )}
          <button className="px-4 py-2 text-gray-500 hover:text-green-400 text-sm sm:text-base">
            Learn More
          </button>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-lg bg-red-300 rounded-3xl shadow-2xl shadow-gray-500 overflow-hidden">
        <Carousel />
      </div>
    </section>
  );
}
export default Hero;