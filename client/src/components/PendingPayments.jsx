import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import currencySymbols from "../data/currencySymbols";
import PropTypes from "prop-types";
import {
  faExclamationTriangle,
  faClock,
  faSearch,
  faFilter,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const apiUrl = import.meta.env.VITE_API_URL;

const statusIcons = {
  Overdue: (
    <FontAwesomeIcon icon={faExclamationTriangle} className="text-[#C81D1E]" />
  ),
  "Due Soon": <FontAwesomeIcon icon={faClock} className="text-yellow-500" />,
  Pending: <FontAwesomeIcon icon={faClock} className="text-blue-500" />,
  Paid: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
};

const PendingPayments = () => {
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSplitId, setSelectedSplitId] = useState(null);
  const [selectedSplitTitle, setSelectedSplitTitle] = useState("");

  const currentUserEmail = localStorage.getItem("userEmail");

  const fetchSplits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        console.error(
          "User ID not found in localStorage. Cannot fetch creator's splits."
        );
        setError("User not logged in. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${apiUrl}/splits?userId=${currentUserId}`
      );
      if (Array.isArray(response.data)) {
        setSplits(response.data);
      } else {
        console.warn(
          "API response for splits was not an array:",
          response.data
        );
        setSplits([]);
        setError("Received unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching splits:", err);
      setError("Failed to load pending payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSplits();
  }, [fetchSplits]);

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

  const getSplitStatus = (split) => {
    if (split.status === "paid") return "Paid";

    const createdDate = new Date(split.createdAt);
    const dueDate = new Date(
      createdDate.setDate(createdDate.getDate() + (split.notifyDays || 0))
    );
    const now = new Date();

    if (now > dueDate) {
      return "Overdue";
    } else if (now.getTime() + 7 * 24 * 60 * 60 * 1000 > dueDate.getTime()) {
      return "Due Soon";
    }
    return "Pending";
  };

  const handleToggleMemberPaidStatus = async (
    splitId,
    memberEmail,
    currentIsPaidStatus
  ) => {
    const newIsPaidStatus = !currentIsPaidStatus;

    try {
      const response = await axios.patch(
        `${apiUrl}/splits/${splitId}/update-member-payment-status`,
        {
          memberEmail,
          isPaid: newIsPaidStatus,
        }
      );

      setSplits((prevSplits) =>
        prevSplits.map((split) =>
          split._id === response.data.split._id ? response.data.split : split
        )
      );
    } catch (err) {
      console.log("Error updating member debt status:", err);
    }
  };
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center  z-500">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-sm  w-9/12 md:w-11/12 mx-auto text-center">
        <p className="text-sm md:text-lg font-semibold mb-4 text-[#1D214B]">{message}</p>
        <div className="flex justify-center gap-2 md:gap-4">
          <button
            onClick={onConfirm}
            className="px-2.5 md:px-4 md:py-2 text-white rounded-md 
           bg-red-700 hover:cursor-pointer text-sm md:text-base transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-2.5 md:px-4 py-2 rounded-md bg-gray-700 ring-2 ring-gray-700 hover:bg-white text-white hover:text-gray-700 hover:cursor-pointer text-sm md:text-base  transition-colors"
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

  const initiateMarkSplitAsComplete = (splitId, splitTitle) => {
    setSelectedSplitId(splitId);
    setSelectedSplitTitle(splitTitle);
    setShowModal(true);
  };

  const confirmMarkSplitAsComplete = async () => {
    setShowModal(false);
    try {
      const response = await axios.patch(
        `${apiUrl}/splits/${selectedSplitId}/mark-split-complete`
      );
      fetchSplits();
    } catch (err) {
      console.error("Error marking split as complete:", err);
    } finally {
      setSelectedSplitId(null);
      setSelectedSplitTitle("");
    }
  };

  const cancelMarkSplitAsComplete = () => {
    setShowModal(false);
    setSelectedSplitId(null);
    setSelectedSplitTitle("");
  };

  const individualSplits = splits.filter((split) => !split.group);
  const groupSplits = splits.filter((split) => split.group);

  const filteredIndividualSplits = individualSplits.filter(
    (split) =>
      (filterStatus
        ? getSplitStatus(split) === filterStatus
        : getSplitStatus(split) !== "Paid") &&
      (split.title.toLowerCase().includes(search.toLowerCase()) ||
        (split.description &&
          split.description.toLowerCase().includes(search.toLowerCase())) ||
        split.amount.toString().includes(search))
  );

  const filteredGroupSplits = groupSplits.filter(
    (split) =>
      (filterStatus
        ? getSplitStatus(split) === filterStatus
        : getSplitStatus(split) !== "Paid") &&
      (split.title.toLowerCase().includes(search.toLowerCase()) ||
        (split.description &&
          split.description.toLowerCase().includes(search.toLowerCase())) ||
        split.amount.toString().includes(search) ||
        (split.group?.name &&
          split.group.name.toLowerCase().includes(search.toLowerCase())))
  );

  if (loading)
    return <div className="text-center p-6">Loading payments...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-2 md:p-4 bg-[#FFFFFF] text-[#1D214B] min-h-screen">
      <h2 className="text-xl md:text-2xl font-bold text-black mb-4 text-center">
        Pending Payments
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <div className="relative text-sm md:text-base w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search by title, description, amount, group name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3C9A]"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div>
        <div className="relative text-sm md:text-base w-full md:w-1/2 lg:w-1/4">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 pl-10 border border-[#9DC3ED] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3C9A]"
          >
            <option value="">Filter By Status</option>
            <option value="Overdue">Overdue</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div>
      </div>

      {/* Individual Pending Payments */}
      <h3 className="text-lg md:text-xl font-semibold text-black mt-4 mb-2 border-b pb-2">
        Individual Pending Payments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredIndividualSplits.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full text-sm md:text-base">
            No individual pending payments.
          </p>
        ) : (
          filteredIndividualSplits.map((split) => (
            <div
              key={split._id}
              className="bg-white p-2 md:p-5 rounded-xl shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm mx-auto flex flex-col"
            >
              <div className="flex items-center gap-4 border-b pb-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#1F3C9A] flex items-center justify-center bg-gray-200 text-gray-600 font-bold">
                  {split.title ? split.title[0] : "S"}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1D214B] mb-1">
                    {split.title}
                  </h3>
                  <p className="text-sm text-gray-600">{split.description}</p>
                  <p className="text-red-700 font-bold flex items-center">
                    <span>
                      {currencySymbols[split.currency] || split.currency}
                    </span>{" "}
                    {split.amount}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  Due:{" "}
                  {split.notifyDays
                    ? `${split.notifyDays} days from creation`
                    : "N/A"}
                </p>
                <p className="flex items-center justify-center gap-1 text-sm">
                  {statusIcons[getSplitStatus(split)]} {getSplitStatus(split)}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                {split.splitDetails.some(
                  (detail) => detail.email === currentUserEmail && detail.isPaid
                ) ? (
                  <button
                    className="w-1/2 px-3 py-2 bg-green-500 text-white rounded-md font-thin hover:cursor-pointer hover:bg-green-600 ring-2 ring-green-500"
                    onClick={() =>
                      handleToggleMemberPaidStatus(
                        split._id,
                        currentUserEmail,
                        true
                      )
                    }
                  >
                    Unmark Paid <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                ) : (
                  <button
                    className="w-1/2 px-2 md:px-3 py-2 bg-[#9DC3ED] text-[#1D214B] rounded-md font-thin hover:cursor-pointer hover:bg-white hover:text-black ring-2 ring-[#1D214B]"
                    onClick={() =>
                      handleToggleMemberPaidStatus(
                        split._id,
                        currentUserEmail,
                        false
                      )
                    }
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Group Payments */}
      <h3 className="text-lg md:text-xl font-semibold text-black border-b mt-4 mb-2 pb-2">
        Group Pending Payments
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {filteredGroupSplits.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No group pending payments.
          </p>
        ) : (
          filteredGroupSplits.map((split) => {
            const splitStatus = getSplitStatus(split);
            const splitPendingAmount = split.splitDetails.reduce(
              (sum, detail) => (detail.isPaid ? sum : sum + detail.amount),
              0
            );

            return (
              <div
                key={split._id}
                className="bg-white px-2 py-4 md:p-5 rounded-xl shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-sm md:drop-shadow-lg w-full max-w-sm mx-auto flex flex-col"
              >
                <div className="flex items-center p-1.5 pb-2 md:pb-3 border-b">
                  {/* Avatar with initial */}
                  <div className="w-12 h-12 rounded-full border-2 border-[#1F3C9A] flex items-center justify-center bg-gray-200 text-[#1F3C9A]  text-xl font-bold flex-shrink-0">
                    {split.title ? split.title[0] : "P"}{" "}
                    {/* Use 'P' for Pending if title is missing */}
                  </div>
                  <div className="flex-grow ml-4">
                    {" "}
                    {/* Added ml-4 here for spacing */}
                    <h3 className="text-lg font-bold text-[#1D214B]">
                      {split.title}{" "}
                      {split.group?.name ? `(${split.group.name})` : ""}
                    </h3>
                    <p className="text-red-700 font-bold flex items-center md:mt-2">
                      <span className="mr-1">
                        {currencySymbols[split.currency] || split.currency}
                      </span>{" "}
                      {splitPendingAmount.toFixed(2)}{" "}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-center ">
                  <p className="flex items-center justify-center gap-1 text-sm">
                    {statusIcons[splitStatus]} {splitStatus}
                  </p>
                </div>

                <div className="mt-3 flex-grow">
                  {split.splitDetails.map((detail) => (
                    <div
                      key={`${split._id}-${detail.email}`}
                      className="flex items-center justify-between text-sm text-gray-700 ml-2 mb-1"
                    >
                      <span className="flex-1 min-w-0 break-words text-left mb-1.5 sm:mb-0">
                        {detail.email}
                        <br /> owes:
                        <span className="ml-1">
                          {currencySymbols[split.currency] || split.currency}
                        </span>{" "}
                        {detail.amount.toFixed(2)}
                      </span>
                      {detail.isPaid ? (
                        <span
                          className="text-green-600 flex items-center cursor-pointer mr-2"
                          onClick={() =>
                            handleToggleMemberPaidStatus(
                              split._id,
                              detail.email,
                              detail.isPaid
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-1 p-2"
                          />{" "}
                          Paid
                        </span>
                      ) : (
                        <button
                          className="md:ml-2 px-1 md:px-2 py-1 md:py-1.5 text-xs ml-0 m-1 mt-2 bg-[#c5d5e8] text-[#1D214B] rounded-sm cursor-pointer"
                          onClick={() =>
                            handleToggleMemberPaidStatus(
                              split._id,
                              detail.email,
                              detail.isPaid
                            )
                          }
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center md:mt-3 mt-2">
                  <button
                    className="w-60 md:w-100 md:px-3 py-2 bg-[#1F3C9A] text-white rounded-lg font-thin  hover:cursor-pointer hover:bg-[#1D214B] text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      initiateMarkSplitAsComplete(split._id, split.title)
                    }
                    disabled={
                      !split.splitDetails.some((detail) => !detail.isPaid)
                    }
                  >
                    Settle this split
                  </button>
                </div>
              </div>
            );
          })
        )}
        {showModal && (
          <ConfirmationModal
            message={`Are you sure you want to mark the entire split "${selectedSplitTitle}" as paid? This will mark all individual debts within it as paid too.`}
            onConfirm={confirmMarkSplitAsComplete}
            onCancel={cancelMarkSplitAsComplete}
          />
        )}
      </div>
    </div>
  );
};

export default PendingPayments;
