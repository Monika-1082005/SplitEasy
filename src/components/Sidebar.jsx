import PropTypes from "prop-types";
import { MoreVertical } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
import sidebarLogo from "../assets/logo_with_text.png";
import sidebarItems from "../data/sidebarItems";

const SidebarContext = createContext();

export default function Sidebar({ expanded }) {
  const [activeItem, setActiveItem] = useState("/"); // Ensure active state is defined

  return (
    <aside>
      <nav className="h-full w-fit flex flex-col bg-white border-r shadow-sm transition-all duration-300">
        <div className={`p-4 flex justify-between items-center relative ${expanded ? "pb-4" : "pb-10"}`}>
          <img
            src={sidebarLogo}
            alt="Logo"
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
          />
        </div>

        {/* Provide activeItem and setActiveItem in context */}
        <SidebarContext.Provider value={{ expanded, activeItem, setActiveItem }}>
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
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User"
            className="w-10 h-10 rounded-md"
          />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  expanded: PropTypes.bool.isRequired,
};

export function SidebarItem({ icon, text, alert, path }) {
  const { expanded, activeItem, setActiveItem } = useContext(SidebarContext);

  return (
    <Link to={path} onClick={() => setActiveItem(path)} className="block">
      <li
        className={`group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
          activeItem === path
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
          {text}
        </span>
        {alert && <div className="absolute right-2 w-2 h-2 rounded bg-indigo-400" />}
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

