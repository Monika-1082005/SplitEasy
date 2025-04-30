import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faCheckCircle, faSearch } from "@fortawesome/free-solid-svg-icons";

const settledSplits = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "../src/assets/user.jpg",
    amount: 1200,
    settledDate: "2025-02-28",
    contact: "+91 9876543210",
    isGroup: false,
  },
  {
    id: 2,
    name: "Sneha Verma",
    avatar: "../src/assets/user.jpg",
    amount: 500,
    settledDate: "2025-02-25",
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
    settledDate: "2025-02-22",
  },
  {
    id: 4,
    name: "Priya Kapoor",
    amount: 950,
    contact: "+91 9812345678",
    group: "Friends Trip",
    isGroup: true,
    settledDate: "2025-02-24",
  },
];

const groupPayments = settledSplits
  .filter((split) => split.isGroup)
  .reduce((acc, split) => {
    if (!acc[split.group]) {
      acc[split.group] = { totalAmount: 0, members: [] };
    }
    acc[split.group].totalAmount += split.amount;
    acc[split.group].members.push(split);
    return acc;
  }, {});

const SettledPayments = () => {
  const [search, setSearch] = useState("");

  const filteredSplits = settledSplits.filter(
    (split) =>
      !split.isGroup &&
      split.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#FFFFFF] text-[#1D214B] min-h-screen">
      <h2 className="text-2xl font-bold text-black mb-4">Settled Payments</h2>

      <div className="relative w-full md:w-1/3 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F3C9A]"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-500" />
      </div>

      <h3 className="text-xl font-semibold text-black mt-4 mb-2">Individual Payments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSplits.length === 0 ? (
          <p className="text-gray-600">No settled payments.</p>
        ) : (
          filteredSplits.map((split) => (
            <div key={split.id} className="bg-white p-4 rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm">
              <div className="flex items-center gap-4 border-b pb-3">
                <img src={split.avatar} alt={split.name} className="w-12 h-12 rounded-full border-2 border-[#1F3C9A]" />
                <div>
                  <h3 className="font-semibold text-[#1D214B]">{split.name}</h3>
                  <p className="text-sm text-gray-600">{split.contact}</p>
                  <p className="text-green-600 font-bold flex items-center">
                    <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" /> {split.amount}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">Settled: {split.settledDate}</p>
                <p className="flex items-center justify-center gap-1 text-sm text-green-500">
                  <FontAwesomeIcon icon={faCheckCircle} /> Settled
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="text-xl font-semibold text-black mt-8 mb-2">Group Payments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(groupPayments).map(([groupName, data], index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm">
            <div className="flex flex-col justify-center items-center pb-3 border-b">
              <h3 className="text-lg font-bold text-[#1D214B]">{groupName}</h3>
              <p className="text-green-600 font-bold flex items-center mt-2">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" /> {data.totalAmount}
              </p>
            </div>
            <div className="mt-3 text-center">
              <p className="flex items-center justify-center gap-1 text-sm text-green-500">
                <FontAwesomeIcon icon={faCheckCircle} /> Settled
              </p>
            </div>
            <div className="mt-3">
              {data.members.map((member) => (
                <p key={member.id} className="text-sm text-gray-700">
                  {member.name}: <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1 ml-1" /> {member.amount} ({member.contact})
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettledPayments;
