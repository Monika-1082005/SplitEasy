import PropTypes from "prop-types";
import { MoreVertical, X } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sidebarLogo from "../assets/logo_with_text.png";
import sidebarItems from "../data/sidebarItems";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ expanded, isMobile, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState(";");

  useEffect(() => {
    const fetchUsername = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`${apiUrl}/users/${userId}`);
        const { username, email } = await res.json();
        if (res.ok) {
          setUsername(username || "User");
          setEmail(email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsername();
  }, [apiUrl]);

  function getInitials(name = "") {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0]; // First letter of first 2 words
    } else if (words.length === 1 && words[0].length >= 2) {
      return words[0][0] + words[0][1]; // First 2 letters
    }
    return name[0] || ""; // fallback
  }

  return (
    <div className={`flex ${isMobile ? "h-screen" : "min-h-screen"}`}>
      <aside
        className={`bg-white border-r shadow-sm transition-all duration-300 flex flex-col flex-grow h-full
    ${
      isMobile
        ? `fixed top-0 left-0 h-screen z-50 transform ${
            expanded ? "translate-x-0" : "-translate-x-full"
          } w-64`
        : `relative h-screen w-fit`
    }
  `}
      >
        <nav className="h-full w-fit flex flex-col bg-white border-r shadow-sm transition-all duration-300">
          <div
            className={`p-4 flex justify-between items-center relative ${
              expanded ? "pb-4" : "pb-10"
            }`}
          >
            <img
              src={sidebarLogo}
              alt="Logo"
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
            />
            {/* Add this below: */}
            {isMobile && expanded && (
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="absolute top-4 right-4 p-1 rounded-md transition"
              >
                <X className="w-6 h-6 text-gray-700 cursor-pointer" />
              </button>
            )}
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 py-4">
              {sidebarItems.map((item, index) => (
                <div key={index}>
                  <SidebarItem
                    icon={<item.icon className="w-5 h-5" />}
                    text={item.text}
                    path={item.path}
                    alert={item.alert}
                  />
                  {item.text === "History" && <hr className="my-4" />}
                </div>
              ))}
            </ul>
          </SidebarContext.Provider>

          <div className="border-t p-3 flex">
            <img
              src={`https://ui-avatars.com/api/?name=${getInitials(
                username
              )}&background=c7d2fe&color=3730a3&bold=true`}
              alt="User"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{username}</h4>
                <span className="text-xs text-gray-600">{email}</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}

Sidebar.propTypes = {
  expanded: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired, // Add this line
  onClose: PropTypes.func.isRequired,
};

export function SidebarItem({ icon, text, alert, path }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link to={path} className="block">
      <li
        className={`group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
          isActive
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div className="absolute right-2 w-2 h-2 rounded bg-indigo-400" />
        )}
        {!expanded && (
          <div
            className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm 
              invisible opacity-0 -translate-x-3 transition-all 
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

SidebarItem.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.string.isRequired,
  alert: PropTypes.bool,
  path: PropTypes.string.isRequired,
};
