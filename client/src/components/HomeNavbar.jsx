import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBell, faBars, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useState,useEffect } from "react";

export default function HomeNavbar({ toggleSidebar, isExpanded }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("User");

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

      <div className="flex items-center gap-4">
        <button className="relative">
          <FontAwesomeIcon icon={faBell} className="text-gray-700 text-xl" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            17
          </span>
        </button>
        <button>
          <FontAwesomeIcon icon={faCircleUser} className="text-gray-700 text-xl" />
        </button>
      </div>
    </nav>
  );
}

HomeNavbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
};
