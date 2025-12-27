import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';


function Navbar() {
    const [user, setUser] = useState(null);
    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(window.scrollY || 0);

    const navigate = useNavigate();

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
        navigate("/Dashboard"); 
        setMobileMenuOpen(false);
    };

    const handleNavClick = (href) => {
        const el = document.getElementById(href.replace('#', ''));
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setMobileMenuOpen(false);
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
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="shadow-md shadow-gray-800 dark:shadow-gray-700 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-500 shadow-lg hover:shadow-purple-300/50 dark:hover:shadow-purple-400/50">
                            <span className="text-white font-bold text-lg sm:text-xl animate-glow">C</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-red-500 to-black bg-clip-text text-transparent dark:from-red-500 dark:to-white">ClubSync</h1>
                    </div>

                    {/* Desktop nav + search */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center space-x-6">
                            <button onClick={() => handleNavClick('#Activities')} className="text-teal-500 dark:text-gray-300 text-lg hover:text-green-500 transition duration-200 relative">
                                Features
                            </button>
                            <button onClick={() => handleNavClick('#clubs')} className="text-teal-500 dark:text-gray-300 text-lg hover:text-green-500 transition duration-200 relative">
                                Clubs
                            </button>
                            <button onClick={() => handleNavClick('#events')} className="text-teal-500 dark:text-gray-300 text-lg hover:text-green-500 transition duration-200 relative">
                                Events
                            </button>
                            <button onClick={() => handleNavClick('#aboutus')} className="text-teal-500 dark:text-gray-300 text-lg hover:text-green-500 transition duration-200 relative">
                                About us
                            </button>
                        </div>
                        <input
                            type='text'
                            placeholder='Search'
                            className="bg-blue-50 text-pink-300 rounded-2xl shadow-sm px-3 py-1 border-2 border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    </div>

                    {/* Desktop auth button */}
                    <div className="hidden md:block">
                        {user ? (
                            <button
                                className="px-5 py-1 shadow-md shadow-gray-500 text-white text-sm sm:text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105"
                                onClick={handleUserClick}
                            >
                                {user.username || user.email}
                            </button>
                        ) : (
                            <button className="px-5 py-1 shadow-md shadow-gray-500 text-white text-sm sm:text-lg font-semibold bg-gradient-to-r from-[#7314f8] to-[#a60886] hover:from-[#8324ff] hover:to-[#b90995] rounded-full transition duration-300 transform hover:scale-105">
                                <Link to="/Login">Login</Link>
                            </button>
                        )}
                    </div>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        {user ? (
                            <button
                                className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#7314f8] to-[#a60886] text-white shadow-md"
                                onClick={handleUserClick}
                            >
                                {user.username || 'Dashboard'}
                            </button>
                        ) : (
                            <button className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#7314f8] to-[#a60886] text-white shadow-md">
                                <Link to="/Login">Login</Link>
                            </button>
                        )}
                        <button
                            className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/80 shadow-md focus:outline-none"
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                            aria-label="Toggle navigation menu"
                        >
                            <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1"></span>
                            <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1"></span>
                            <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-gradient-to-b from-white/95 via-purple-50 to-blue-50 dark:from-black dark:via-gray-900 dark:to-black border-t border-purple-100/60 px-4 pb-4 space-y-3">
                    <input
                        type='text'
                        placeholder='Search'
                        className="w-full mt-2 bg-blue-50 text-pink-300 rounded-2xl shadow-sm px-3 py-2 border-2 border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <button onClick={() => handleNavClick('#Activities')} className="block w-full text-left py-2 text-teal-600 dark:text-gray-200 text-base">
                        Features
                    </button>
                    <button onClick={() => handleNavClick('#clubs')} className="block w-full text-left py-2 text-teal-600 dark:text-gray-200 text-base">
                        Clubs
                    </button>
                    <button onClick={() => handleNavClick('#events')} className="block w-full text-left py-2 text-teal-600 dark:text-gray-200 text-base">
                        Events
                    </button>
                    <button onClick={() => handleNavClick('#aboutus')} className="block w-full text-left py-2 text-teal-600 dark:text-gray-200 text-base">
                        About us
                    </button>
                </div>
            )}
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