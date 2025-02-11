/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
// import AuthContext from "./context/AuthProvider";

const PrivateRoute = ({ children,adminOnly}) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

   // If adminOnly is true, check if user is an admin
   if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />; // Redirect non-admin users to Home
  }

  return  children ;
};

export default PrivateRoute;
