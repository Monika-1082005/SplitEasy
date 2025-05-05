import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  faPlus,
  faUsers,
  faAddressBook,
  faTimes,
  faLink,
  faImage,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import splitMoney from "../assets/split_money.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CreateSplit() {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [emails, setEmails] = useState([""]);
  const [emailErrors, setEmailErrors] = useState([""]);
  const [groups, setGroups] = useState(["Friends", "Family"]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [splitOption, setSplitOption] = useState("equally");
  const [groupName, setGroupName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [userId, setUserId] = useState(null);
  const [inviteToken, setInviteToken] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const addEmailField = () => {
    setEmails([...emails, ""]);
    setEmailErrors([...emailErrors, ""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);

    const newErrors = [...emailErrors];
    newErrors[index] =
      isValidEmail(value) || value === "" ? "" : "Invalid email format";
    setEmailErrors(newErrors);
  };

  const handleSendInvite = async () => {
    try {
      const res = await axios.post(`${apiUrl}/create-group`, {
        name: groupName,
        createdBy: "6818b4d049374b022f6ca50b",
      });

      if (res.data.inviteLink && res.data.inviteToken) {
        setInviteLink(res.data.inviteLink);
        setInviteToken(res.data.inviteToken);
      } else {
        toast.error("Failed to generate invite link",{autoClose:2000});
      }
    } catch (err) {
      console.error("Error generating invite link:", err);
      toast.error("Could not generate invite link",{autoClose:2000});
    }
  };

  const handleImportContacts = async () => {
    // Redirect user for authentication
    window.location.href = `${apiUrl}/auth/google`;
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/contacts`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        const filtered = data
          .filter((contact) => {
            const name = contact.names?.[0]?.displayName;
            const hasEmail = contact.emailAddresses?.[0]?.value;
            const hasPhone = contact.phoneNumbers?.[0]?.value;

            // Only include if name exists AND (email or phone exists)
            return name && (hasEmail || hasPhone);
          })
          .sort((a, b) => {
            const nameA = a.names[0].displayName.toLowerCase();
            const nameB = b.names[0].displayName.toLowerCase();
            return nameA.localeCompare(nameB);
          });

        setContacts(filtered);
      } else {
        setError("Failed to fetch contacts");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while fetching contacts");
    } finally {
      setLoading(false);
    }
  };


  const formatContact = (contact) => {
    const name = contact.names?.[0]?.displayName;
    const email = contact.emailAddresses?.[0]?.value;
    let phone = contact.phoneNumbers?.[0]?.value;

    // Skip if no name or no contact info
    if (!name || (!email && !phone)) return null;

    // Format the phone number
    if (phone) {
      // Remove any non-numeric characters, keep the "+" sign
      phone = phone.replace(/[^\d+]/g, "");

      // Ensure the number starts with +91 (India's country code)
      if (!phone.startsWith("+91")) {
        phone = `+91${phone.replace(/^(\+?\d{1,3})?(\d{10})$/, "$2")}`;
      }
    }

    let details = name;
    if (email) details += ` | ${email}`;
    if (phone) details += ` | ${phone}`;

    return details;
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-4xl flex flex-col md:flex-row items-center">
        <div className="flex-1 flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold mb-4 text-[#1D214B]">
            Create a Split
          </h2>
          <button
            className="flex items-center justify-center w-3/4 p-3 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] transition hover:cursor-pointer"
            onClick={() => setShowSplitModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add a Split
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={splitMoney}
            alt="Split Money"
            className="max-w-full rounded-md"
          />
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-[#1D214B]">
            Create a Group
          </h2>
          <button
            className="flex items-center justify-center w-3/4 p-3 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] transition hover:cursor-pointer"
            onClick={() => setShowGroupModal(true)}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Add a Group
          </button>
        </div>

        <div className="flex-1 bg-white p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg flex flex-col items-center">
  <h2 className="text-lg font-semibold mb-4 text-[#1D214B]">
    Import Contacts
  </h2>
  <div className="flex w-full justify-between">
    <button
      className="flex items-center justify-center w-1/2 p-3 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] transition hover:cursor-pointer"
      onClick={handleImportContacts}
    >
      <FontAwesomeIcon icon={faAddressBook} className="mr-2" />
      Import Contacts
    </button>
    <button
      onClick={fetchContacts}
      className="flex items-center justify-center w-1/2 px-3 py-2 ml-2 bg-[#198754] text-white rounded-md font-semibold hover:cursor-pointer hover:bg-white hover:text-black ring-2 ring-[#198754]"
    >
      <FontAwesomeIcon icon={faSync} className="mr-2" />
      Fetch Contacts
    </button>
  </div>
  {/* Loading and Error Messages */}
  {loading && <p className="mt-4 text-gray-700">Loading contacts...</p>}
  {error && <p className="mt-4 text-red-500">{error}</p>}
</div>

      </div>

      {showGroupModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => setShowGroupModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-[#1D214B]">
              Create Group
            </h2>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="mb-4">
              <button
                className="w-full p-2 bg-[#1F3C9A] text-white rounded-md hover:cursor-pointer flex items-center justify-center"
                onClick={handleSendInvite}
              >
                Send Invite Link{" "}
                <FontAwesomeIcon icon={faLink} className="ml-2" />
              </button>

              {inviteLink && (
                <div className="mt-3 bg-gray-100 p-2 rounded-md flex items-center justify-between">
                  <span className="text-sm break-all">{inviteLink}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      toast.info("Link copied!",{autoClose:1000});
                    }}
                    className="ml-2 text-blue-600 text-sm hover:underline cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              {emails.map((email, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                      emailErrors[index] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {emailErrors[index] && (
                    <p className="text-red-500 text-sm mt-1">
                      {emailErrors[index]}
                    </p>
                  )}
                </div>
              ))}
              <button
                className="text-[#1F3C9A] hover:cursor-pointer"
                onClick={addEmailField}
              >
                + Add
              </button>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 ring-2 text-[#198754] ring-[#198754] hover:bg-[#198754] hover:text-white rounded-md hover:cursor-pointer"
                onClick={async () => {
                  const validEmails = emails.filter(
                    (email) => email.trim() !== ""
                  );

                  const hasInvalidEmails = validEmails.some(
                    (email) => !isValidEmail(email)
                  );

                  if (hasInvalidEmails) {
                    toast.info(
                      "Please fix invalid email(s) before submitting.",{autoClose:2000}
                    );
                    return;
                  }

                  try {
                    const res = await axios.post(
                      `${apiUrl}/create`,
                      {
                        name: groupName,
                        memberEmails: validEmails,
                        createdBy: "6818b4d049374b022f6ca50b",
                        inviteToken,
                      }
                    );
                    toast.success("Group created successfully!",{autoClose:2000});
                    setShowGroupModal(false);
                    setGroupName("");
                    setEmails([""]);
                    setEmailErrors([""]);
                  } catch (err) {
                    console.error("Error creating group:", err);
                    toast.error("Failed to create group",{autoClose:2000});
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showSplitModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-3xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => setShowSplitModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-[#1D214B]">
              Add a Split
            </h2>

            <div className="mb-4 flex items-center space-x-4">
              <label
                htmlFor="split-title"
                className="font-semibold min-w-[15px]"
              >
                Title:
              </label>
              <input
                type="text"
                id="split-title"
                placeholder="Add Title for Split"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Flex container for two options */}
            <div className="flex space-x-4 mb-4">
              <select className="w-1/2 p-2 border border-gray-300 rounded-md">
                <option>Select Group</option>
                {groups.map((group, index) => (
                  <option key={index}>{group}</option>
                ))}
              </select>

              <input
                type="date"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full border border-gray-300 rounded-md p-2 max-h-64 overflow-y-auto">
              <p className="font-semibold">Select Contact</p>

              {contacts.map((contact, index) => {
                const contactLabel = formatContact(contact);
                return (
                  <label
                    key={index}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      value={contactLabel}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected((prev) => [
                            ...(prev || []),
                            contactLabel,
                          ]);
                        } else {
                          setSelected((prev) =>
                            prev?.filter((item) => item !== contactLabel)
                          );
                        }
                      }}
                    />
                    <span className="text-gray-700">{contactLabel}</span>
                  </label>
                );
              })}
            </div>

            {/* Display selected contacts */}
            {selected?.length > 0 && (
              <div className="w-full p-2 text-gray-700">
                <strong>Selected Contacts:</strong>
                <ul className="list-disc ml-6">
                  {selected.map((contact, index) => (
                    <li key={index}>{contact}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flex container for Divide Equally and Date */}
            <div className="flex space-x-4 mb-4 mt-4">
              <input
                type="number"
                placeholder="Amount"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md"
                value={splitOption}
                onChange={(e) => setSplitOption(e.target.value)}
              >
                <option value="equally">Divide Equally</option>
                <option value="individual">Assign Individual Amount</option>
              </select>
            </div>

            {/* Flex container for Description and Add Image/Note */}
            <div className="flex space-x-4 mb-4">
              <textarea
                placeholder="Add Description"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />

              <button className="w-1/2 p-2 bg-gray-200 rounded-md hover:cursor-pointer">
                <FontAwesomeIcon icon={faImage} /> Add Image/Note
              </button>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 ring-2 text-[#198754] ring-[#198754] hover:bg-[#198754] hover:text-white rounded-md hover:cursor-pointer">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer /> 
    </div>
  );
}
