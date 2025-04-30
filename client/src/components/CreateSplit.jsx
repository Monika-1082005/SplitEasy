import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUsers,
  faAddressBook,
  faTimes,
  faLink,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import splitMoney from "../assets/split_money.png";

export default function CreateSplit() {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [emails, setEmails] = useState([""]);
  const [groups, setGroups] = useState(["Friends", "Family"]);
  const [contacts, setContacts] = useState(["Alice", "Bob", "Charlie"]);
  const [splitOption, setSplitOption] = useState("equally");

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
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

      {/* Below Cards */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Add Group Card */}
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

        {/* Import Contacts Card */}
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

      {/* Create Group Modal */}
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
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <button className="w-full p-2 mb-4 bg-[#1F3C9A] text-white rounded-md hover:cursor-pointer">
              Send Invite Link <FontAwesomeIcon icon={faLink} />
            </button>
            <div className="mb-4">
              {emails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                />
              ))}
              <button className="text-[#1F3C9A] hover:cursor-pointer" onClick={addEmailField}>
                + Add
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

      {/* Add Split Modal */}
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
    </div>
  );
}
