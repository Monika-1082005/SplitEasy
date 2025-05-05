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
  const [contacts, setContacts] = useState(["Alice", "Bob", "Charlie"]);
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
        createdBy: "6814ab0cbe772976ee29fc7a",
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
          <button className="flex items-center justify-center w-3/4 p-3 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] transition hover:cursor-pointer">
            <FontAwesomeIcon icon={faAddressBook} className="mr-2" />
            Import from Contacts
          </button>
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
                        createdBy: "6814ab0cbe772976ee29fc7a",
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
          <div className="bg-white p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.2),0px_-4px_15px_rgba(0,0,0,0.1)] drop-shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => setShowSplitModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-[#1D214B]">
              Add a Split
            </h2>
            <select className="w-full p-2 mb-4 border border-gray-300 rounded-md">
              <option>Select Group</option>
              {groups.map((group, index) => (
                <option key={index}>{group}</option>
              ))}
            </select>
            <select className="w-full p-2 mb-4 border border-gray-300 rounded-md">
              <option>Select Contact</option>
              {contacts.map((contact, index) => (
                <option key={index}>{contact}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <select
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              value={splitOption}
              onChange={(e) => setSplitOption(e.target.value)}
            >
              <option value="equally">Divide Equally</option>
              <option value="individual">Assign Individual Amount</option>
            </select>
            <input
              type="date"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <button className="w-full p-2 mb-4 bg-gray-200 rounded-md hover:cursor-pointer">
              <FontAwesomeIcon icon={faImage} /> Add Image/Note
            </button>
            <textarea
              placeholder="Add Description"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
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
