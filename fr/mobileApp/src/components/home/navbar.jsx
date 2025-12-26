import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';


function Navbar() {
    const [user, setUser] = useState(null);
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(window.scrollY);

    const history = useHistory();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 10) {
                setShowNavbar(true);
                lastScrollY.current = window.scrollY;
                return;
            }
            if (window.scrollY > lastScrollY.current) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            lastScrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleUserClick = () => {
        history.push("/Dashboard"); 
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
                showNavbar ? 'translate-y-0' : '-translate-y-full'
            } bg-transparent opacity-85 bg-gradient-to-r from-white/95 via-purple-100 to-blue-50 dark:from-black dark:via-gray-800 dark:to-black backdrop-blur-xl border-b border-gradient-to-r from-purple-200/50 to-blue-200/50`}
        >
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-500">
                <div className="absolute top-4 left-1/2 w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce opacity-70"></div>
                <div className="absolute top-2 left-1/4 w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full animate-float opacity-60"></div>
                <div className="absolute top-6 left-7 w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full animate-float opacity-60"></div>
                <div className="absolute top-4 right-1/3 w-1 h-1 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce-subtle opacity-40"></div>
                <div className="absolute top-1 left-2/3 w-1.5 h-1.5 bg-pink-400 dark:bg-pink-300 rounded-full animate-float opacity-50"></div>
                <div className="absolute top-8 left-1/3 w-2.5 h-0.5 bg-pink-400 dark:bg-pink-300 rounded-full animate-float opacity-50"></div>
            </div>
            
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center lg:ml-[130px] sm:ml-10">
                        <div className="shadow-md shadow-gray-800 dark:shadow-gray-700 mr-1 w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-500 shadow-lg hover:shadow-purple-300/50 dark:hover:shadow-purple-400/50 group-hover:scale-110">
                            <span className="text-white font-bold text-xl animate-glow">C</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-b from-red-500 to-black bg-clip-text text-transparent dark:from red-500 dark:to-white">ClubSync</h1>
                    </div>
                    <div className="hidden md:flex items-center space-x-20    ">
                        <NavLink href="#Activities" text="Features" />
                        <NavLink href="#clubs" text="Clubs" />
                        <NavLink href="#events" text="Events" />
                        <NavLink href="#aboutus" text="About us" />
                    </div>
                    <input type='text' placeholder='    search' className="bg-blue-50 text-pink-300 rounded-2xl shadow-sm px-4 py-1 border-2 border-red-300 hover:py-2 transition-all duration-300"></input>
                    {user ? (
                        <button
                            className="mr-[100px] px-6 py-1 shadow-md shadow-gray-500 text-white text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105"
                            onClick={handleUserClick}
                        >
                            {user.username || user.email}
                        </button>
                    ) : (
                        <button className="mr-[100px] px-6 py-1 shadow-md shadow-gray-500 text-white text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105">
                            <Link to="/Login">Login</Link>
                        </button>
                    )}
                </div>
            </div>
            
        </nav>
    );
}

const NavLink = ({ href, text }) => (
  <a
    href={href}
    onClick={e => {
      e.preventDefault();
      const el = document.getElementById(href.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }}
    className="text-teal-500 dark:text-gray-300 text-lg hover:text-green-500 transition duration-200 relative"
  >
    {text}
  </a>
);

export default Navbar;