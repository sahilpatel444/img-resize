import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token"); // ✅ Get token from localStorage
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Correct token format
        });

        console.log("Fetched Users:", res.data);
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error.response?.data || error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <button 
        onClick={logout} 
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>

      <ul className="mt-4">
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u._id} className="p-2 border-b">
              {u.name} - {u.email} - {u.isAdmin ? "Admin" : "User"}
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;
