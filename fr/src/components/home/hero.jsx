import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Carousel from './caurosel';
function Hero() {

  const [user, setUser] = useState(null);
      const [showNavbar, setShowNavbar] = useState(true);
  
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


    const [mov,stemov]=useState({t:50,b:50});
    useEffect(()=>
    {
      const mv=setInterval(()=>
      {
        stemov({t:Math.random()*90,b:Math.random()*90});
      },800); 
      return ()=>clearInterval(mv);
    },[]);

    const [a,seta]=useState(0);

  return (
    <div className="h-screen flex ">       
    <div className="hero ml-[200px] mt-60 max-md:ml-20 max-sm:ml-0 w-[600px]">


      <h1
        className="text-[3rem] font-extrabold leading-[1.2] mb-6 bg-gradient-to-r from-[#4361ee] to-[#f72585] bg-clip-text text-transparent"
       >
        Manage our Campus Clubs With Efficiency
      </h1>
      <p className="text-[17px] text-gray-500">ClubWeb is a comprehensive solution for managing memberships, events, finances, and communications - all in one powerful platform.</p>
        {user ? (
                        <button
                            className="mr-[100px] px-6 py-1 mt-12 shadow-md shadow-gray-500 text-white text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105"
                            onClick={handleUserClick}
                        >
                            {user.username || user.email}
                        </button>
                    ) : (
                        <button className="mr-[100px] px-6 py-1 mt-10 shadow-md shadow-gray-500 text-white text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105">
                            <Link to="/Login">Get Started</Link>
                        </button>
                    )}
          <a className=" px-6 py-2  text-gray-400 rounded-full hover:text-green-300 ">
          Learn More
          </a>
    </div>
    <div className="mt-[180px] ml-[100px]  bg-red-300 h-[450px] rounded-3xl shadow-2xl shadow-gray-500 flex-row" >
            <Carousel />
    </div>
    <div className="w-5 h-10 bg-gradient-to-t from-red-400 to-purple-300 absolute bottom-8 ml-[700px] animate-bounce rounded-3xl px-2 py-2"><p className="bg-lime-500 text-transparent">|</p></div>
    </div>

  );
}
export default Hero;