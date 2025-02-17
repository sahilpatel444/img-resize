import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // Assuming `setUser` updates the user context after a successful update
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [number, setNumber] = useState(user.number || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const ClearLocalStorage = () => {
    alert(
      "Detected in unauthorized modification. Are you sure you want to logout?"
    );
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  
  // Handle form submission
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = user.id || user._id; // Use id if _id is not present

      if (!userId) {
        throw new Error("User ID is missing");
      }
      const response = await axios.put(
        `${import.meta.env.VITE_BLACKEND_URL}/api/auth/users/${userId}`,
        {
          name,
          email,
          number,
        }
      
      );
      // Update context with the new data
      setUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
    //   toast.error("Failed to update profile. Please try again.");
      if (error.response?.data?.logout) {
        ClearLocalStorage(); // Call the logout function
      }
    } finally {
      setLoading(false);
    }
  };
  //   console.log("User:", JSON.stringify(user, null, 2));
  //   console.log("User ID:", user?._id);

  return (
    <>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-center font-bold text-2xl mb-4">Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium">
              Mobile No
            </label>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    
    </>
  );
};

export default Profile;
