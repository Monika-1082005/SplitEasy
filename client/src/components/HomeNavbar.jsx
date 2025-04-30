import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBell, faBars, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function HomeNavbar({ toggleSidebar, isExpanded }) {
  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      <button onClick={toggleSidebar}>
        <FontAwesomeIcon
          icon={isExpanded ? faBarsStaggered : faBars}
          className="text-gray-700 text-xl cursor-pointer"
        />
      </button>

      <span className="text-xl text-gray-800 font-semibold">
        Hello John Doe!
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
