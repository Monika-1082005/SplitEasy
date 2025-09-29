import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faBars,
  faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function HomeNavbar({ toggleSidebar, isExpanded,  setIsLoggedIn }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("User");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`${apiUrl}/users/${userId}`);
        const { username } = await res.json();
        if (res.ok) {
          setUsername(username || "User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsername();
  }, [apiUrl]);

    useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    }

    if (showLogout) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogout]);

   const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    navigate("/");; 
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      <button onClick={toggleSidebar}>
        <FontAwesomeIcon
          icon={isExpanded ? faBarsStaggered : faBars}
          className="text-gray-700 text-xl cursor-pointer"
        />
      </button>

      <span className="text-xl text-gray-800 font-semibold">
        Hello {username}!
      </span>

      <div className="relative">
        <button
          onClick={() => setShowLogout(!showLogout)} 
          aria-expanded={showLogout} 
          aria-haspopup="true" 
          aria-label="User menu" 
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            className="text-gray-700 text-2xl lg:text-3xl cursor-pointer"
          />
        </button>

        {showLogout && (
          
          <div className="absolute right-0 mt-2 bg-gray-100 border border-gray-300 rounded-lg shadow-lg w-48 z-50 p-2" ref={dropdownRef}>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowLogout(false)}
                className="text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition-colors duration-200 cursor-pointer"
                aria-label="Close menu"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 text-md font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 flex items-center justify-center cursor-pointer space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

HomeNavbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};
