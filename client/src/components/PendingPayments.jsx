import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faExclamationTriangle,
  faClock,
  faSearch,
  faFilter,
  faBell,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const apiUrl = "http://localhost:3001";

const statusIcons = {
  Overdue: (
    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
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
  const [filterStatus, setFilterStatus] = useState(""); // Corrected: should be useState("")

  const currentUserId = localStorage.getItem("userId");
  const currentUserEmail = localStorage.getItem("userEmail");

  const fetchSplits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUserId || !currentUserEmail) {
        console.error("User details missing in localStorage:", {
          currentUserId,
          currentUserEmail,
        });
        setError("User not logged in or user details missing. Please log in.");
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${apiUrl}/splits?userId=${currentUserId}&userEmail=${currentUserEmail}`
      );
      setSplits(response.data);
    } catch (err) {
      console.error("Error fetching splits:", err);
      setError("Failed to load pending payments.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserEmail]);

  useEffect(() => {
    fetchSplits();
  }, [fetchSplits]);

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

      toast.success(response.data.message);
    } catch (err) {
      console.log("Error updating member debt status:", err);
      toast.error(
        `Failed to mark member's debt as ${
          newIsPaidStatus ? "paid" : "unpaid"
        }.`
      );
    }
  };

  const handleMarkSplitAsComplete = async (splitId, splitTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to mark the entire split "${splitTitle}" as paid? This will mark all individual debts within it as paid too.`
      )
    ) {
      return;
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/splits/${splitId}/mark-split-complete`
      );
      fetchSplits();
      console.log(response.data.message);
    } catch (err) {
      console.error("Error marking split as complete:", err);
      toast.error(
        `Failed to mark split as complete: ${
          err.response?.data?.message || err.message
        }`
      );
    }
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
    <div className="p-6 bg-[#FFFFFF] text-[#1D214B] min-h-screen">
      <h2 className="text-2xl font-bold text-black mb-4">Pending Payments</h2>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by title, description, amount, group name"
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
      <h3 className="text-xl font-semibold text-black mt-4 mb-2">
        Individual Payments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredIndividualSplits.length === 0 ? (
          <p className="text-gray-600">No individual pending payments.</p>
        ) : (
          filteredIndividualSplits.map((split) => (
            <div
              key={split._id}
              className="bg-white p-4 rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm"
            >
              <div className="flex items-center gap-4 border-b pb-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#1F3C9A] flex items-center justify-center bg-gray-200 text-gray-600 font-bold">
                  {split.title ? split.title[0] : "N/A"}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1D214B]">
                    {split.title}
                  </h3>
                  <p className="text-sm text-gray-600">{split.description}</p>
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
                <button className="w-1/2 px-3 py-2 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] font-light hover:cursor-pointer ">
                  Send Reminder <FontAwesomeIcon icon={faBell} />
                </button>
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
                    className="w-1/2 px-3 py-2 bg-[#9DC3ED] text-[#1D214B] rounded-md font-thin hover:cursor-pointer hover:bg-white hover:text-black ring-2 ring-[#1D214B]"
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
      <h3 className="text-xl font-semibold text-black mt-8 mb-2">
        Group Payments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGroupSplits.length === 0 ? (
          <p className="text-gray-600">No group pending payments.</p>
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
                className="bg-white p-4 rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-sm flex flex-col justify-center"
              >
                <div className="flex flex-col justify-center items-center pb-3 border-b">
                  <h3 className="text-lg font-bold text-[#1D214B]">
                    {split.title} ({split.group?.name || "Unknown Group"}){" "}
                  </h3>
                  <p className="text-red-600 font-bold flex items-center mt-2">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="mr-1"
                    />{" "}
                    {splitPendingAmount.toFixed(2)}{" "}
                  </p>
                </div>

                <div className="mt-3 text-center ">
                  <p className="text-sm text-gray-600">Status: {splitStatus}</p>
                  <p className="flex items-center justify-center gap-1 text-sm">
                    {statusIcons[splitStatus]} {splitStatus}
                  </p>
                </div>

                <div className="mt-3">
                  {split.splitDetails.map((detail) => (
                    <div
                      key={`${split._id}-${detail.email}`}
                      className="flex items-center justify-between text-sm text-gray-700 ml-2 mb-1"
                    >
                      <span className="flex-1">
                        {detail.email} owes:
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="mr-1 ml-1"
                        />{" "}
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
                            className="mr-1"
                          />{" "}
                          Paid
                        </span>
                      ) : (
                        <button
                          className="ml-2 px-2 py-1 text-xs m-1 bg-[#c5d5e8] text-[#1D214B] rounded-sm"
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
                <div className="flex gap-2 mt-3">
                  <button className="w-1/2 px-3 py-2 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] font-light hover:cursor-pointer ">
                    Send Reminder <FontAwesomeIcon icon={faBell} />
                  </button>
                  <button
                    className="w-1/2 px-3 py-2 bg-blue-500 text-white rounded-md font-thin hover:cursor-pointer hover:bg-white hover:text-black ring-2 ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      handleMarkSplitAsComplete(split._id, split.title)
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
      </div>
    </div>
  );
};

export default PendingPayments;
