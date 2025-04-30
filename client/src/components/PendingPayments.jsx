import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faExclamationTriangle,
  faClock,
  faSearch,
  faFilter,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const pendingSplits = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "../src/assets/user.jpg",
    amount: 1200,
    dueDate: "2025-03-10",
    status: "Overdue",
    contact: "+91 9876543210",
    isGroup: false,
  },
  {
    id: 2,
    name: "Sneha Verma",
    avatar: "../src/assets/user.jpg",
    amount: 500,
    dueDate: "2025-03-15",
    status: "Due Soon",
    contact: "+91 9123456780",
    isGroup: false,
  },
  {
    id: 3,
    name: "Amit Singh",
    amount: 800,
    contact: "+91 9988776655",
    group: "Friends Trip",
    isGroup: true,
    dueDate: "2025-03-12",
    status: "Overdue",
  },
  {
    id: 4,
    name: "Priya Kapoor",
    amount: 950,
    contact: "+91 9812345678",
    group: "Friends Trip",
    isGroup: true,
    dueDate: "2025-03-14",
    status: "Due Soon",
  },
  {
    id: 5,
    name: "Priya Kapoor",
    avatar: "../src/assets/user.jpg",
    amount: 10000,
    dueDate: "2025-03-18",
    status: "Due Soon",
    contact: "+91 9812345678",
    isGroup: false,
  },
  {
    id: 6,
    name: "John Doe",
    amount: 8000,
    contact: "+91 9288776455",
    group: "Timepass",
    isGroup: true,
    dueDate: "2025-03-20",
    status: "Due Soon",
  },
];

const statusIcons = {
  Overdue: (
    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
  ),
  "Due Soon": <FontAwesomeIcon icon={faClock} className="text-yellow-500" />,
};

// Group pending calculations
const groupPayments = pendingSplits
  .filter((split) => split.isGroup)
  .reduce((acc, split) => {
    if (!acc[split.group]) {
      acc[split.group] = { totalAmount: 0, members: [] };
    }
    acc[split.group].totalAmount += split.amount;
    acc[split.group].members.push(split);
    return acc;
  }, {});

const PendingPayments = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredSplits = pendingSplits.filter(
    (split) =>
      !split.isGroup && // Ensure only individual payments are listed
      split.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? split.status === filterStatus : true)
  );

  return (
    <div className="p-6 bg-[#FFFFFF] text-[#1D214B] min-h-screen">
      <h2 className="text-2xl font-bold text-black mb-4">Pending Payments</h2>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name, amount"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F3C9A]"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div>
        <div className="relative w-full md:w-1/4">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3C9A]"
          >
            <option value="">Filter By Status</option>
            <option value="Overdue">Overdue</option>
            <option value="Due Soon">Due Soon</option>
          </select>
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div>
      </div>

      {/* Individual Pending Payments */}
      <h3 className="text-xl font-semibold text-black mt-4 mb-2">
        Individual Payments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSplits.length === 0 ? (
          <p className="text-gray-600">No pending payments.</p>
        ) : (
          filteredSplits.map((split) => (
            <div
              key={split.id}
              className="bg-white p-4 rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm"
            >
              <div className="flex items-center gap-4 border-b pb-3">
                <img
                  src={split.avatar}
                  alt={split.name}
                  className="w-12 h-12 rounded-full border-2 border-[#1F3C9A]"
                />
                <div>
                  <h3 className="font-semibold text-[#1D214B]">{split.name}</h3>
                  <p className="text-sm text-gray-600">{split.contact}</p>
                  <p className="text-red-600 font-bold flex items-center">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="mr-1"
                    />{" "}
                    {split.amount}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">Due: {split.dueDate}</p>
                <p className="flex items-center justify-center gap-1 text-sm">
                  {statusIcons[split.status]} {split.status}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="w-1/2 px-3 py-2 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] font-light hover:cursor-pointer ">
                  Send Reminder <FontAwesomeIcon icon={faBell} />
                </button>
                <button className="w-1/2 px-3 py-2 bg-[#198754] text-white rounded-md  font-thin  hover:cursor-pointer hover:bg-white hover:text-black ring-2 ring-[#198754]">
                  Mark as Paid
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Group Payments */}
      <h3 className="text-xl font-semibold text-black mt-8 mb-2">
        Group Payments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(groupPayments).map(([groupName, data], index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm"
          >
            <div className="flex flex-col justify-center items-center pb-3 border-b">
              <h3 className="text-lg font-bold text-[#1D214B]">{groupName}</h3>
              <p className="text-red-600 font-bold flex items-center mt-2">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />{" "}
                {data.totalAmount}
              </p>
            </div>

            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Due: {data.members[0]?.dueDate || "N/A"}
              </p>
              <p className="flex items-center justify-center gap-1 text-sm">
                {statusIcons[data.members[0]?.status]}{" "}
                {data.members[0]?.status || "N/A"}
              </p>
            </div>

            {/* Member Details */}
            <div className="mt-3">
              {data.members.map((member) => (
                <p key={member.id} className="text-sm text-gray-700">
                  {member.name}:{" "}
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="mr-1 ml-1"
                  />{" "}
                  {member.amount} ({member.contact})
                </p>
                
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              <button className="w-1/2 px-3 py-2 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] font-light hover:cursor-pointer ">
                Send Reminder <FontAwesomeIcon icon={faBell} />
              </button>
              <button className="w-1/2 px-3 py-2 bg-[#198754] text-white rounded-md  font-thin  hover:cursor-pointer hover:bg-white hover:text-black ring-2 ring-[#198754]">
                Mark as Paid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingPayments;
