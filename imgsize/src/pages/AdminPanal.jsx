import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { socket } from "../socket";

const AdminPanel = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [navbarItems, setNavbarItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", href: "", dropdown: [] });
  const [editingItem, setEditingItem] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef(null);
  const usersPerPage = 10;
  const [isVerifying, setIsVerifying] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [exportType, setExportType] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const [response, setResponse] = useState(null);

  // const backend_url = import.meta.env.VITE_BLACKEND_URL;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const ClearLocalStorage = () => {
    alert(
      "Detected in unauthorized modification. Are you sure you want to logout?"
    );
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  // message send to all user
  const handleSendMessage = async () => {
    if (!title || !message) {
      alert("Please enter both title and message");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/send-message`,
        { title, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      setTitle("");
      setMessage("");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };
  // delete message
  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/messages/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        console.log("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  useEffect(() => {
    // Fetch messages from the backend
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BLACKEND_URL}/api/auth/messages`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for real-time message deletion
    socket.on("deleteMessage", (deletedMessageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedMessageId));
    });

    return () => socket.off("deleteMessage");
  }, []);

  // fetch user data
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_BLACKEND_URL}/api/admin/users`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       console.log("Fetched Users:", res.data);
  //       setUsers(res.data);
  //     } catch (error) {
  //       console.error("Failed to fetch users:", error.response?.data || error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // fetch navbar data
  useEffect(() => {
    fetchNavbarItems();
  }, []);

  //  all navbar edits haldler
  // fetch navbar item and user user unthorized to logout
  const fetchNavbarItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/navbar`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNavbarItems(res.data);
      console.log(res.data, "fetch navbar items in admin panel");
    } catch (error) {
      console.error("Error fetching navbar items:", error);
      if (error.response?.data?.logout) {
        ClearLocalStorage(); // Call the logout function
      }
    }
  };

  const handleAddNavbarItem = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/navbar`,
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNavbarItems();
      setNewItem({ name: "", href: "", dropdown: [] });
      alert("Navbar item added successfully!");
    } catch (error) {
      console.error(
        "Error adding navbar item:",
        error.response?.data || error.message
      );
      if (error.response?.data?.logout) {
        ClearLocalStorage(); // Call the logout function
      }
    }
  };

  const handleUpdateNavbarItem = async () => {
    const token = localStorage.getItem("token");
    if (!editingItem) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/navbar/${
          editingItem._id
        }`,
        editingItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Navbar item updated successfully!");
      fetchNavbarItems(); // Refresh the navbar list
      setEditingItem(null); // Reset edit mode
    } catch (error) {
      console.error("Error updating navbar item:", error);
    }
  };

  const handleAddDropdownItem = () => {
    setNewItem({
      ...newItem,
      dropdown: [...newItem.dropdown, { name: "", href: "" }],
    });
  };

  const handleDropdownChange = (index, key, value) => {
    const updatedDropdown = [...newItem.dropdown];
    updatedDropdown[index][key] = value;
    setNewItem({ ...newItem, dropdown: updatedDropdown });
  };
  // remove dropdown item first
  const handleRemoveDropdownItem = (index) => {
    const updatedDropdown = newItem.dropdown.filter((_, i) => i !== index);
    setNewItem({ ...newItem, dropdown: updatedDropdown });
  };
  // navbar item delete
  const handleDeleteNavbarItem = async (id) => {
    var result = confirm("Are you sure you want to delete this navbar item?");
    if (result) {
      //Logic to delete the item
      const token = localStorage.getItem("token");

      try {
        await axios.delete(
          `${import.meta.env.VITE_BLACKEND_URL}/api/admin/navbar/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Navbar item deleted successfully!");
        fetchNavbarItems();
      } catch (error) {
        console.error("Error deleting navbar item:", error);
      }
    }
  };
  // navbar dropdown edit
  const handleDropdownEditChange = (index, key, value) => {
    const updatedDropdown = [...editingItem.dropdown];
    updatedDropdown[index][key] = value;
    setEditingItem({ ...editingItem, dropdown: updatedDropdown });
  };
  //  dropdown cancel edit button
  const handleRemoveDropdownEditItem = (index) => {
    const updatedDropdown = editingItem.dropdown.filter((_, i) => i !== index);
    setEditingItem({ ...editingItem, dropdown: updatedDropdown });
  };

  // Add dropdown while editing an existing navbar item
  const handleAddDropdownEditItem = () => {
    if (!editingItem) return;

    setEditingItem({
      ...editingItem,
      dropdown: [...editingItem.dropdown, { name: "", href: "" }],
    });
  };

  // all user detaila handler

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // paginathing logic fetch user
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BLACKEND_URL
        }/api/admin/users/page?page=${page}&limit=${usersPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.length < usersPerPage) {
        setHasMore(false); // No more users to load
      }

      console.log(users, "fetch all users");

      // Merge users and remove duplicates based on `_id`
      setUsers((prevUsers) => {
        const uniqueUsers = [...prevUsers, ...res.data].reduce((acc, user) => {
          if (!acc.some((u) => u._id === user._id)) {
            acc.push(user);
          }
          return acc;
        }, []);

        return uniqueUsers;
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Scroll Event
  const handleScroll = () => {
    if (
      tableRef.current &&
      tableRef.current.scrollTop + tableRef.current.clientHeight >=
        tableRef.current.scrollHeight - 10
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Function to update user role
  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/update-role`,
        { userId, isAdmin: newRole === "Admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, isAdmin: newRole === "Admin" }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleAccessChange = async (userId, dropdownId, isChecked) => {
    console.log("User ID:", userId);
    console.log("Dropdown ID:", dropdownId);
    console.log("Checked:", isChecked);

    try {
      // Find the user in the state
      const user = users.find((u) => u._id === userId);
      const existingDropdownIds =
        user?.dropdownAccess?.map((d) => d.dropdownId) || [];

      // Update dropdown access dynamically
      const updatedDropdownIds = isChecked
        ? [...new Set([...existingDropdownIds, dropdownId])] // Add if checked
        : existingDropdownIds.filter((id) => id !== dropdownId); // Remove if unchecked

      // Send updated dropdown access list to the backend
      const res = await fetch(
        `${
          import.meta.env.VITE_BLACKEND_URL
        }/api/admin/update-dropdown-access/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ dropdownIds: updatedDropdownIds }), // Send full list
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update dropdown access: ${res.status}`);
      }

      console.log("Dropdown access updated successfully.");

      // Update the local state to reflect the changes
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId
            ? {
                ...u,
                dropdownAccess: updatedDropdownIds.map((id) => ({
                  dropdownId: id,
                })),
              }
            : u
        )
      );
    } catch (error) {
      console.error("Error updating dropdown access:", error);
    }
  };

  // Function to export data as CSV
  // const exportToCSV = () => {
  //   if (users.length === 0) return;

  //   const header = ["Name,Email,Phone Number,Role"];
  //   const rows = users.map(
  //     (user) =>
  //       `${user.name},${user.email},${user.number || "N/A"},${
  //         user.isAdmin ? "Admin" : "User"
  //       }`
  //   );

  //   const csvContent = [header, ...rows].join("\n");
  //   const blob = new Blob([csvContent], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "imgsizex_data.csv";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // Function to export data as PDF
  const verifyAndExport = async () => {
    setError(null);
    const token = localStorage.getItem("token");
    try {
      console.log("Verifying admin...");

      const res = await axios.post(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/verify-password`,
        {
          email: user.email,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", res.data); // Log API response

      if (res.data.success) {
        setIsVerifying(false);
        setPassword("");
        exportType === "csv" ? exportToCSV() : exportToPDF();
      } else {
        setError(res.data.message || "Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error(
        "Verification error:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    }
  };
  // export button click to call api
  const allUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BLACKEND_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Assuming response contains the user data
    } catch (error) {
      console.error("Error fetching users:", error);

      return [];
    }
  };

  const exportToCSV = async () => {
    const users = await allUsers(); // Fetch latest users from backend
    if (users.length === 0) return;

    const header = ["Name,Email,Phone Number,Role"];
    const rows = users.map(
      (user) =>
        `${user.name},${user.email},${user.number || "N/A"},${
          user.isAdmin ? "Admin" : "User"
        }`
    );

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "users_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    const users = await allUsers(); // Fetch latest users from backend
    if (users.length === 0) return;

    const doc = new jsPDF();
    doc.text("Users Data", 14, 10);

    const tableColumn = ["Name", "Email", "Phone Number", "Role"];
    const tableRows = users.map((user) => [
      user.name,
      user.email,
      user.number || "N/A",
      user.isAdmin ? "Admin" : "User",
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("users_data.pdf");
  };
  const handleExport = (type) => {
    setIsVerifying(true);
    setExportType(type);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4 ">Admin Panel</h2>
      <div className="flex flex-col lg:flex-row gap-8 p-4 ">
        {/* Navbar Edit Section */}
        <div className="w-full lg:w-2/3 bg-white shadow-md p-5 rounded-lg overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Navbar Edit</h2>

          {/* Add Navbar Item Form */}
          <div className="mb-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Navbar Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border p-2 rounded w-full md:w-auto"
            />
            <input
              type="text"
              placeholder="Navbar Item URL"
              value={newItem.href}
              onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
              className="border p-2 rounded w-full md:w-auto"
            />
            <button
              onClick={handleAddDropdownItem}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              + Add Dropdown
            </button>
            <button
              onClick={handleAddNavbarItem}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Item
            </button>
          </div>

          {/* Dropdown Items */}
          {newItem.dropdown.map((dropdown, index) => (
            <div key={index} className="mb-2 flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Dropdown Name"
                value={dropdown.name}
                onChange={(e) =>
                  handleDropdownChange(index, "name", e.target.value)
                }
                className="border p-2 rounded w-full md:w-auto"
              />
              <input
                type="text"
                placeholder="Dropdown URL"
                value={dropdown.href}
                onChange={(e) =>
                  handleDropdownChange(index, "href", e.target.value)
                }
                className="border p-2 rounded w-full md:w-auto"
              />
              <button
                onClick={() => handleRemoveDropdownItem(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}

          {/* Navbar Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">URL</th>
                  <th className="border p-2">Dropdown Items</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {navbarItems.map((item) => (
                  <tr key={item._id} className="border">
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.href}</td>
                    <td className="border p-2">
                      {item.dropdown.length > 0 ? (
                        <ul>
                          {item.dropdown.map((drop, i) => (
                            <li key={i}>
                              {drop.name} ({drop.href})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNavbarItem(item._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Navbar Item */}
          {editingItem && (
            <div className="mt-4">
              <div className="mb-4 flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Navbar Item Name"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="border p-2 rounded w-full md:w-auto"
                />
                <input
                  type="text"
                  placeholder="Navbar Item URL"
                  value={editingItem.href}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, href: e.target.value })
                  }
                  className="border p-2 rounded w-full md:w-auto"
                />
                <button
                  onClick={handleUpdateNavbarItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Item
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>

              {/* Edit Dropdown Items */}
              {editingItem.dropdown.map((dropdown, index) => (
                <div
                  key={index}
                  className="mb-2 flex flex-col md:flex-row gap-2"
                >
                  <input
                    type="text"
                    placeholder="Dropdown Name"
                    value={dropdown.name}
                    onChange={(e) =>
                      handleDropdownEditChange(index, "name", e.target.value)
                    }
                    className="border p-2 rounded w-full md:w-auto"
                  />
                  <input
                    type="text"
                    placeholder="Dropdown URL"
                    value={dropdown.href}
                    onChange={(e) =>
                      handleDropdownEditChange(index, "href", e.target.value)
                    }
                    className="border p-2 rounded w-full md:w-auto"
                  />
                  <button
                    onClick={() => handleRemoveDropdownEditItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}

              {/* Button to Add Dropdown in Edit Mode */}
              <button
                onClick={handleAddDropdownEditItem}
                className="bg-gray-500 text-white px-4 py-2 mt-2 rounded"
              >
                + Add Dropdown
              </button>
            </div>
          )}
        </div>

        {/* Send Message Section */}
        <div className="w-full lg:w-1/3 bg-white shadow-md p-5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Send Message to All Users</h2>
          <input
            type="text"
            placeholder="Enter Title"
            className="w-full p-2 border rounded-lg mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter Message"
            className="w-full p-2 border rounded-lg mb-3"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Send Message
          </button>

          {/* Scrollable Message List */}
          <div className="max-h-48 overflow-y-scroll pr-3 scrollbar-hide mt-4">
            <h2 className="text-xl font-bold mb-4">Message List</h2>
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages available.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-3 border rounded-lg mb-3 flex justify-between items-center bg-gray-50"
                >
                  <div>
                    <h3 className="font-semibold">{msg.title}</h3>
                    <p className="text-gray-700">{msg.message}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* data table user */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">All User </h2>
        {/* Export Buttons */}
        <div className="flex justify-end">
          <div className="relative inline-block text-left">
            {/* Export Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Export Data ▼
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                <button
                  onClick={() => handleExport("csv")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export to CSV
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export to PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Table */}
        <div
          ref={tableRef}
          className="overflow-y-auto max-h-96 border border-gray-300 rounded-lg shadow-md mt-2"
          onScroll={handleScroll}
        >
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Dropdown Access</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4 border">{user.name}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">{user.number || "N/A"}</td>
                    <td className="py-2 px-4 border">
                      <select
                        value={user.isAdmin ? "Admin" : "User"}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        // className="border p-1 rounded text-gray-700"
                        className={classNames(
                          user.isAdmin ? "text-green-500" : ""
                        )}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-2 px-4 border">
                      <div className="flex flex-col">
                        {navbarItems?.map((navbar) =>
                          navbar?.dropdown?.map((dropdown) => {
                            // If user is admin, show all checkboxes
                            const isChecked = user?.dropdownAccess?.some(
                              (d) => d.dropdownId === dropdown._id
                            );

                            return (
                              <label
                                key={dropdown._id}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleAccessChange(
                                      user._id,
                                      dropdown._id,
                                      e.target.checked
                                    )
                                  }
                                  className="mr-2"
                                />
                                {dropdown.name} ({navbar.name})
                              </label>
                            );
                          })
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-4">
              <span className="text-gray-600">Loading more users...</span>
            </div>
          )}
        </div>

        {/* password verify  */}
        {isVerifying && (
          <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
            <form
              className="bg-white p-6 rounded shadow-lg"
              onSubmit={(e) => e.preventDefault()} // Prevent form submission refresh
            >
              <h3 className="text-lg font-bold mb-2">Admin Verification</h3>
              <p>Enter your password to proceed:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full mt-2"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsVerifying(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={verifyAndExport}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-2 bg-gray-200">
        <h1 className=" flex items-center justify-center m-10 font-bold text-3xl">
          {" "}
          The End
        </h1>
      </div>
    </div>
  );
};

export default AdminPanel;
