import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import currencySymbol from "../data/currencySymbols";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {
  faSearch,
  faFilter,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto text-center">
        <p className="text-lg font-semibold mb-4 text-[#1D214B]">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const apiUrl = import.meta.env.VITE_API_URL;

const SettledPayments = () => {
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSplitId, setSelectedSplitId] = useState(null);
  const [selectedSplitTitle, setSelectedSplitTitle] = useState("");

  const currentUserId = localStorage.getItem("userId");

  const fetchSettledSplits = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUserId) {
        console.error(
          "User ID not found in localStorage. Cannot fetch settled splits."
        );
        setError("User not logged in. Please log in.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${apiUrl}/settled`, {
        params: { userId: currentUserId },
      });

      if (Array.isArray(response.data)) {
        setSplits(response.data);
      } else {
        console.warn(
          "API response for settled splits was not an array:",
          response.data
        );
        setError(
          "Received unexpected data format from server. Please ensure the API URL is correct and the endpoint returns an array (JSON data)."
        );
        setSplits([]);
      }
    } catch (err) {
      console.error("Error fetching settled splits:", err);
      setError(
        "Failed to load settled payments. This might be due to an incorrect API URL or network issues. Please ensure 'YOUR_API_BASE_URL_HERE' is replaced with your actual backend URL."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettledSplits();
  }, [currentUserId]);

  // Effect to manage body scroll
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  /**
   * @param {string} splitId - The ID of the split to mark as not settled.
   * @param {string} splitTitle - The title of the split for confirmation message.
   */
  const handleMarkSplitAsNotSettled = async (splitId, splitTitle) => {
    setSelectedSplitId(splitId);
    setSelectedSplitTitle(splitTitle);
    setShowModal(true);
  };

  const confirmMarkAsNotSettled = async () => {
    setShowModal(false);

    try {
      const response = await axios.patch(
        `${apiUrl}/splits/${selectedSplitId}/mark-not-settled`
      );

      fetchSettledSplits();
      toast.success(response.data.message || "Split marked as not settled.");
    } catch (err) {
      console.error("Error marking split as not settled:", err);
      toast.error(
        `Failed to mark split as not settled: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSelectedSplitId(null);
      setSelectedSplitTitle("");
    }
  };

  const cancelMarkAsNotSettled = () => {
    setShowModal(false); // Hide modal
    setSelectedSplitId(null);
    setSelectedSplitTitle("");
  };

  // Filter splits based on search query and filter type
  const filteredSplits = splits.filter((split) => {
    const matchesSearch =
      split.title.toLowerCase().includes(search.toLowerCase()) ||
      (split.group?.name &&
        split.group.name.toLowerCase().includes(search.toLowerCase())) ||
      split.amount.toString().includes(search);

    const isIndividual = !split.group;
    const isGroup = !!split.group;

    if (filterType === "individual" && !isIndividual) return false;
    if (filterType === "group" && !isGroup) return false;

    return matchesSearch;
  });

  // Separate filtered splits into individual and group categories
  const individualSettledSplits = filteredSplits.filter(
    (split) => !split.group
  );
  const groupSettledSplits = filteredSplits.filter((split) => split.group);

  if (loading)
    return <div className="text-center p-6">Loading settled payments...</div>;

  return (
    <div className="p-4 bg-[#FFFFFF] text-[#1D214B] min-h-screen ">
      <h2 className="text-xl md:text-2xl font-bold text-black mb-4 text-center">
        Settled Payments
      </h2>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search by title, amount, group name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3C9A] text-gray-800 placeholder-gray-500 shadow-sm"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div>
        <div className="relative w-full md:w-1/2 lg:w-1/4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3C9A] text-gray-800 shadow-sm appearance-none"
          >
            <option value="">Filter by Type</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
          </select>
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute left-3 top-3 text-gray-500"
          />
          {/* <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Individual Settled Payments Section */}
      <h3 className="text-lg md:text-xl font-semibold text-black mt-4 mb-2 border-b pb-2">
        Individual Settled Payments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {individualSettledSplits.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No individual settled payments found.
          </p>
        ) : (
          individualSettledSplits.map((split) => {
            const totalPaid = split.splitDetails.reduce(
              (sum, detail) => sum + detail.amount,
              0
            );

            return (
              <div
                key={split._id}
                className="bg-white p-5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2),0_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm mx-auto flex flex-col"
              >
                <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
                  {/* Avatar with initial */}
                  <div className="w-12 h-12 rounded-full border-2 border-green-600 flex items-center justify-center bg-gray-200 text-green-600 text-xl font-bold flex-shrink-0">
                    {split.title ? split.title[0] : "S"}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-[#1D214B] mb-1">
                      {split.title}
                    </h3>
                    <p className="text-green-600 font-bold flex items-center text-lg">
                      <span className="mr-1">
                        {currencySymbol[split.currency] || split.currency}
                      </span>
                      {totalPaid.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-auto text-center pt-3">
                  <p className="text-base font-semibold text-green-700 flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500"
                    />
                    All dues have been settled 🎉
                  </p>
                  <button
                    onClick={() =>
                      handleMarkSplitAsNotSettled(split._id, split.title)
                    }
                    className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-thin"
                  >
                    Mark as Not Settled
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Group Settled Payments Section */}
      <h3 className=" text-lg md:text-xl font-semibold text-black mt-4 md:mt-4 mb-2 border-b pb-2">
        Group Settled Payments
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {groupSettledSplits.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No group settled payments found.
          </p>
        ) : (
          groupSettledSplits.map((split) => {
            const totalPaid = split.splitDetails.reduce(
              (sum, detail) => sum + detail.amount,
              0
            );

            return (
              <div
                key={split._id}
                className="bg-white p-5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2),0_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm mx-auto flex flex-col"
              >
                <div className="flex items-center gap-4 pb:2  border-b border-gray-200 ">
                  {/* Avatar with initial */}
                  <div className="w-12 h-12 rounded-full border-2 border-green-600 flex items-center justify-center bg-gray-200 text-green-600 text-xl font-bold flex-shrink-0">
                    {split.title ? split.title[0] : "S"}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg md:text-xl text-[#1D214B]">
                      {split.title}{" "}
                      {split.group?.name ? `(${split.group.name})` : ""}
                    </h3>
                    <p className="text-green-600 font-bold flex items-center text-lg mr-1">
                      <span className="mr-1">
                        {currencySymbol[split.currency] || split.currency}
                      </span>
                      {totalPaid.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex-grow">
                  <p className="font-medium mb-2 text-[#1D214B] border-b pb-1">
                    Members:
                  </p>
                  <ul className="space-y-2">
                    {split.splitDetails.map((member, index) => (
                      <li
                        key={index}
                        className="flex flex-col text-gray-700 text-sm p-0.25"
                      >
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="flex-1 min-w-0 break-words text-left pr-2">
                            {member.email}
                          </span>
                          <span className="flex-shrink-0 flex items-baseline gap-1 text-green-600 font-semibold ml-2 ">
                            <span>
                              {currencySymbol[split.currency] || split.currency}
                            </span>
                            {member.amount.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 text-right ml-auto">
                          {member.paidAt
                            ? new Date(member.paidAt).toLocaleDateString()
                            : "Paid"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto text-center pt-4">
                  <p className="text-sm md:text-base font-semibold text-green-700 flex items-center justify-center gap-1 md:gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500"
                    />
                    All dues have been settled 🎉
                  </p>
                  <button
                    onClick={() =>
                      handleMarkSplitAsNotSettled(split._id, split.title)
                    }
                    className="mt-3 w-full px-4 py-1.5 md:py-2 bg-[#f09595] hover:text-white text-black-500 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Mark as Not Settled
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <ConfirmationModal
          message={`Are you sure you want to mark the split "${selectedSplitTitle}" as NOT settled? This will move it back to pending payments.`}
          onConfirm={confirmMarkAsNotSettled}
          onCancel={cancelMarkAsNotSettled}
        />
      )}
    </div>
  );
};

export default SettledPayments;
