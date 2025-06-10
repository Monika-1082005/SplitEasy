import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  faPlus,
  faUsers,
  faAddressBook,
  faTimes,
  faLink,
  faImage,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import splitMoney from "../assets/split_money.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import currencyOptions from "../data/currencyOptions";
import currencySymbols from "../data/currencySymbols";

export default function CreateSplit() {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [emails, setEmails] = useState([""]);
  const [emailErrors, setEmailErrors] = useState([""]);
  const [groups, setGroups] = useState([]);
  const [groupNameError, setGroupNameError] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [splitOption, setSplitOption] = useState("equally");
  const [groupName, setGroupName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [notifyDays, setNotifyDays] = useState(0);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const fileInputRef = useRef(null);
  const [individualAmounts, setIndividualAmounts] = useState({});
  const selectedGroupObj = groups.find((g) => g._id === selectedGroup);
  const groupMemberEmails = selectedGroupObj
    ? selectedGroupObj.members.map((m) => m.email)
    : [];
  const [currency, setCurrency] = useState("");

  const resetSplitForm = () => {
    setTitle("");
    setNotifyDays("");
    setAmount("");
    setSplitOption("equally");
    setDescription("");
    setFileName("No file chosen");
    setSelected(null);
    setSelectedGroup("");
    setCurrency("INR");
    setTitleError("");
    // Do NOT reset group or contacts here
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "No file chosen");
  };

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

  const handleAddGroupClick = () => {
    setShowGroupModal(true);
    setInviteLink(null); // Reset the invite link when the modal opens
  };

  const handleSendInvite = async () => {
    // Retrieve the userId from localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User is not logged in or userId not found", {
        autoClose: 2000,
      });
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/create-group`, {
        name: groupName,
        createdBy: userId, // Use the userId from localStorage here
      });

      if (res.data.inviteLink && res.data.inviteToken) {
        setInviteLink(res.data.inviteLink);
        setInviteToken(res.data.inviteToken);
        setGroups((prev) => [...prev, groupName]);
      } else {
        toast.error("Failed to generate invite link", { autoClose: 2000 });
      }
    } catch (err) {
      console.error("Error generating invite link:", err);
      toast.error("Could not generate invite link", { autoClose: 2000 });
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

  useEffect(() => {
    fetchGroups(); // Initial load
  });

  const fetchGroups = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`${apiUrl}/get-groups`, {
          params: { createdBy: userId },
        })
        .then((res) => {
          if (res.data.success) {
            setGroups(res.data.groups);
          } else {
            toast.error("Failed to load groups", { autoClose: 2000 });
          }
        })
        .catch((err) => {
          console.error("Error fetching groups:", err);
          toast.error("Something went wrong while fetching groups", {
            autoClose: 2000,
          });
        });
    } else {
      toast.error("No user logged in", { autoClose: 2000 });
    }
  };

  const handleGroupSave = async () => {
    const trimmedName = groupName.trim();

    // ✅ Check for empty group name
    if (trimmedName.length === 0) {
      setGroupNameError("Please specify a group name.");
      return;
    } else {
      setGroupNameError(""); // Clear any previous error
    }

    const validEmails = emails.filter((email) => email.trim() !== "");

    const hasInvalidEmails = validEmails.some((email) => !isValidEmail(email));

    if (hasInvalidEmails) {
      toast.info("Please fix invalid email(s) before submitting.", {
        autoClose: 2000,
      });
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found. Please login again.", {
          autoClose: 2000,
        });
        return;
      }

      const res = await axios.post(`${apiUrl}/create`, {
        name: trimmedName, // use trimmed name
        memberEmails: validEmails,
        createdBy: userId,
        inviteToken,
      });

      toast.success("Group created successfully!", {
        autoClose: 2000,
      });

      setShowGroupModal(false);
      setGroups((prev) => [...prev, res.data.group]);
      setGroupName("");
      setEmails([""]);
      setEmailErrors([""]);
    } catch (err) {
      console.error("Error creating group:", err);
      toast.error("Failed to create group", { autoClose: 2000 });
    }
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value); // Handle group selection
  };

  const handleSplitSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User is not logged in or userId not found", {
        autoClose: 2000,
      });
      return;
    }

    // Title validation: Check if title is empty or only whitespace
    if (!title.trim()) {
      toast.error("Please enter a title for the split", {
        autoClose: 2000,
      });
      return;
    }

    // Validation: must select at least a group or contact
    if (!selectedGroup && (!selected || selected.length === 0)) {
      toast.error("You must select at least a group or a contact", {
        autoClose: 2000,
      });
      return;
    }

    // Currency validation: Check if currency is selected
    if (!currency || currency === "") {
      toast.error("Please select a currency for the split", {
        autoClose: 2000,
      });
      return;
    }

    // Amount validation: Check if amount is provided
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount for the split", {
        autoClose: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("group", selectedGroup || "");
    formData.append("contacts", JSON.stringify(selected || []));
    formData.append("notifyDays", notifyDays);
    formData.append("currency", currency);
    formData.append("amount", amount);
    formData.append("splitOption", splitOption);
    formData.append("description", description);
    formData.append("createdBy", userId);

    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const response = await axios.post(`${apiUrl}/splits`, formData);
      console.log("Split saved:", response.data);
      toast.success("Your split has been created successfully!", {
        autoClose: 2000,
      });
      setShowSplitModal(false); // Close modal after saving
    } catch (error) {
      console.error("Error saving split:", error);
      toast.error("There was an error saving the split. Please try again.", {
        autoClose: 2000,
      });
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
            onClick={() => {
              resetSplitForm(); // Resets form fields
              fetchGroups();
              setShowSplitModal(true); // Opens modal
            }}
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
            onClick={handleAddGroupClick}
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
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {groupNameError && (
              <p style={{ color: "red", fontSize: "0.9rem" }}>
                {groupNameError}
              </p>
            )}
            <div className="mb-4 mt-4">
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
                      toast.info("Link copied!", { autoClose: 1000 });
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
                onClick={handleGroupSave}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {titleError && (
                <span className="text-red-500 text-sm">{titleError}</span>
              )}
            </div>

            {/* Flex container for two options */}
            <div className="flex space-x-4 mb-4">
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md"
                value={selectedGroup}
                onChange={handleGroupChange}
              >
                <option>Select Group</option>
                {groups.map((group, index) => (
                  <option key={index} value={group._id}>
                    {" "}
                    {/* Assuming group._id is unique */}
                    {group.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
                placeholder="Notify After (days)"
                value={notifyDays}
                onChange={(e) => setNotifyDays(e.target.value)}
                min="0"
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
              <div className="flex gap-2">
                <Select
                  value={currencyOptions.find(
                    (option) => option.value === currency
                  )}
                  options={currencyOptions}
                  onChange={(selected) => setCurrency(selected.value)}
                  placeholder="Select Currency"
                  className="w-60"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: "41.5px", // Input field height
                    }),
                    option: (base) => ({
                      ...base,
                      fontFamily: "Roboto, sans-serif", // Apply font to options
                      fontWeight: 700,
                      fontSize:"16px"
                      
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontFamily: "Roboto, sans-serif", // Apply custom font to the selected value (when an option is selected)
                      fontWeight: 700,
                      fontSize:"16px"
                    }),
                  }}
                />
                <CurrencyInput
                  decimalsLimit={2}
                  onValueChange={(value) => setAmount(value)}
                  className="border border-gray-300 pl-2 py-2 px-2 rounded w-50 text-base"
                  placeholder="Enter Amount"
                />
              </div>

              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md"
                value={splitOption}
                onChange={(e) => setSplitOption(e.target.value)}
              >
                <option value="equally">Divide Equally</option>
                <option value="individual">Assign Individual Amount</option>
              </select>
            </div>

            {splitOption === "equally" && groupMemberEmails.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-2 text-[#1D214B]">
                  Split Summary (Equally):
                </p>
                <ul className="list-disc ml-6 text-gray-700">
                  {groupMemberEmails.map((email, index) => (
                    <li key={index} className="text-md flex items-center">
                      {email}:
                      <span className="flex items-center">
                        {currencySymbols[currency]}
                        <span>
                          {(amount / groupMemberEmails.length).toFixed(2)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {splitOption === "individual" && groupMemberEmails.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-2 text-[#1D214B]">
                  Assign Individual Amounts:
                </p>
                <div className="space-y-2">
                  {groupMemberEmails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-1/3 text-gray-700">{email}</span>
                      <input
                        type="number"
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Enter amount"
                        value={individualAmounts[email] || ""}
                        onChange={(e) =>
                          setIndividualAmounts((prev) => ({
                            ...prev,
                            [email]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flex container for Description and Add Image/Note */}

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <textarea
                  placeholder="Add Description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="w-1/2 flex flex-col items-start space-y-1">
                <button
                  className="w-full p-2 bg-gray-200 rounded-md hover:cursor-pointer flex items-center space-x-2 justify-center "
                  onClick={() => fileInputRef.current.click()}
                >
                  <FontAwesomeIcon icon={faImage} />
                  <span>Add Image/Note</span>
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <span className="text-sm text-gray-600 self-center">
                  {fileName}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-2 ring-2 text-[#198754] ring-[#198754] hover:bg-[#198754] hover:text-white rounded-md hover:cursor-pointer"
                onClick={handleSplitSave}
              >
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
