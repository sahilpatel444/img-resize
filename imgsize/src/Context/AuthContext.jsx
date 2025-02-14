/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState('')
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
  var result =confirm("Are you sure you want to logout?");
  if(result){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
}

  return (
    <AuthContext.Provider value={{ user, setUser, logout, token ,setToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
