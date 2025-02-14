import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useDetectLocalStorageTamper = () => {
  const navigate = useNavigate();
  const [originalUser, setOriginalUser] = useState(localStorage.getItem("user"));

//   useEffect(() => {
//     const checkUserData = () => {
//       const currentUser = localStorage.getItem("user");

//       if (!currentUser) return; // Don't trigger logout if there's no user data initially

//       try {
//         const parsedUser = JSON.parse(currentUser);

//         // Ensure valid login session
//         if (!parsedUser || !parsedUser.token) {
//           console.warn("Invalid user data detected. Logging out.");
//           alert("Unauthorized modification detected. You have been logged out.");
//           localStorage.removeItem("user");
//           navigate("/login");
//           return;
//         }

//         // Only logout if localStorage is modified after login
//         if (originalUser && originalUser !== currentUser) {
//           console.warn("Tampered localStorage detected. Logging out.");
//           alert("Unauthorized modification detected. You have been logged out.");
//           localStorage.removeItem("user");
//           navigate("/login");
//         }
//       } catch (error) {
//         console.warn("LocalStorage data corrupted. Logging out.");
//         alert("Unauthorized modification detected. You have been logged out.");
//         localStorage.removeItem("user");
//         navigate("/login");
//       }
//     };

//     // Run every 2 seconds to check for modifications
//     const interval = setInterval(checkUserData, 2000);

//     return () => clearInterval(interval);
//   }, [navigate, originalUser]);

//   // Update originalUser when logging in
//   useEffect(() => {
//     setOriginalUser(localStorage.getItem("user"));
//   }, []); // This runs once when the user logs in
};

export default useDetectLocalStorageTamper;
