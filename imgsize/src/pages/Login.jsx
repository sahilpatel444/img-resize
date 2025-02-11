import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user, } = res.data; // Get token and isAdmin status
   
    
      // Store in localStorage
      localStorage.setItem("token", token );
      localStorage.setItem("user", JSON.stringify({ user }));

      // Update context state
      setUser({ token, ...user });


      // ✅ Check user role and navigate accordingly
      if (user.isAdmin) {
        navigate("/admin"); // Redirect Admin to Dashboard
      } else {
        navigate("/"); // Redirect User to Home Page
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
