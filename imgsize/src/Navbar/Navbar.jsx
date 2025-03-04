// import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  // ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Logo from "../assets/img/logo2.png";
import profilelogo from "../assets/img/profillogo1.jpg";
import { ChevronDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import axios from "axios";
import { socket } from "../socket"; // Import socket.js
import { FaGithub } from "react-icons/fa";

// const navigation = [
//   { name: "Image Resizers", href: "/resize", current: true },
//   { name: "Crop Image", href: "/", current: false },
//   {
//     name: "Compress",

//     current: false,
//     dropdown: [
//       { name: "MB to KB", href: "/resize" },
//       { name: "JPG to PNG", href: "/compress/jpg-to-png" },
//       { name: "Pdf To Comprase", href: "/compress/pdf-to-comprase" },
//     ],
//   },
//   {
//     name: "Convert",

//     current: false,
//     dropdown: [
//       { name: "IMG to PDF", href: "/convert/img-to-pdf" },
//       { name: "PDF to IMG", href: "/convert/pdf-to-img" },
//       { name: "WEBP to PNG", href: "/convert/webp-to-png" },
//     ],
//   },
//   { name: "Bulk Resize", href: "/bulk-resize", current: false },
// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// console.log(import.meta.env.VITE_BLACKEND_URL, "socket");

const Navbar = () => {
  const navigate = useNavigate(); // If using Next.js
  const [openDropdown, setOpenDropdown] = useState(false);
  // const [navbarOpen, setNavbarOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const [navbarItems, setNavbarItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // dwd
  // useEffect(() => {
  //   // Listen for new messages
  //   socket.on("newMessage", (newMessage) => {
  //     setNotifications((prev) => [...prev, newMessage]);
  //   });

  //   return () => {
  //     socket.off("newMessage"); // Clean up listener on component unmount
  //   };
  // }, []);

  // massage notification
  // useEffect(() => {
  //   // Fetch messages from the backend
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_BLACKEND_URL}/api/auth/messages`
  //       );
  //       setNotifications(res.data);
  //       console.log(res.data, "notification data");
  //     } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   };

  //   fetchNotifications();
  //   // Listen for new messages via Socket.io
  //   socket.on("newMessage", (message) => {
  //     setNotifications((prev) => [message, ...prev]);
  //   });

  //   return () => socket.off("newMessage");
  // }, []);
  // .fetch notiication details in database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BLACKEND_URL}/api/auth/messages`
        );
        setNotifications(res.data);
        console.log(res.data, "notification data");
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Listen for new messages via Socket.io
    const handleNewMessage = (newMessage) => {
      setNotifications((prev) => [newMessage, ...prev]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage); // ✅ Proper cleanup
    };
  }, []);

  useEffect(() => {
    const fetchNavbarItems = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found, redirecting to login.");
          return;
        }

        console.log("Using Token:", token); // Debug: Check if the token is retrieved correctly

        const res = await fetch(
          `${import.meta.env.VITE_BLACKEND_URL}/api/navbar/navbar-items`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach token correctly
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `HTTP error! Status: ${res.status} - ${errorData.message}`
          );
        }

        const data = await res.json();
        console.log("Fetched Navbar Items:", data);

        setNavbarItems(Array.isArray(data) ? data : data.navbarItems || []);
      } catch (error) {
        console.error("Error fetching navbar items:", error);
        setNavbarItems([]);
      }
    };

    fetchNavbarItems();
  }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img alt="Your Company" src={Logo} className="h-8 w-auto " />
              </Link>
            </div>
            {/* navabr items in database */}
            <div className="hidden sm:ml-6 sm:block ">
              <div className="flex space-x-4">
                {navbarItems.map((item, index) => (
                  <Link
                    key={item?._id}
                    to={item?.href}
                    onMouseEnter={() => item.dropdown && setOpenDropdown(index)}
                    onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                  >
                    <div
                      to={item?.href}
                      className={classNames(
                        item ? "bg-gray-800 text-white" : "",
                        "hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium flex items-center"
                      )}
                    >
                      {/* Main Navigation Items */}
                      <button
                        onClick={() =>
                          (!item.dropdown || item.dropdown.length === 0) &&
                          navigate(item.href)
                        }
                        className="bg-gray-800  text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center"
                      >
                        {item.name}
                        {item.dropdown && item.dropdown.length > 0 && (
                          <ChevronDown
                            className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                              openDropdown === index ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                    {item.dropdown?.length > 0 && openDropdown === index && (
                      <div className="absolute  w-40 bg-gray-800 text-white rounded-md shadow-lg">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* notification icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ">
              {/* <button>
              <Link to='/github.com'>
                <FaGithub size={30} />
              </Link>
              </button> */}

              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-2 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
                // onMouseEnter={() => setShowDropdown(!showDropdown)}
                // onMouseLeave={() => setShowDropdown(true)}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto border scrollbar-hide">
                  <div className="py-2 hide-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-center py-2">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((msg) => (
                        <div
                          key={msg._id}
                          className="px-4 py-2 border-b last:border-0 hover:bg-gray-700 "
                        >
                          <h3 className="font-semibold text-gray-100 text-left truncate">
                            {msg.title}
                          </h3>
                          <p className="text-sm text-gray-100 mt-1 text-left line-clamp-2 overflow-hidden ">
                            {msg.message}
                          </p>
                          <small className="text-xs text-gray-400 block mt-1 text-right">
                            {new Date(msg.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={profilelogo}
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                {!user ? (
                  <>
                    <MenuItem>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        You are Guast User
                      </Link>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        {!user ? "My Profile" : user.name}
                      </Link>
                    </MenuItem>
                  </>
                )}
                <MenuItem>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </Link>
                </MenuItem>
                {!user ? (
                  <>
                    <MenuItem>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Login
                      </Link>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Link
                        to="/"
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        LogOut
                      </Link>
                    </MenuItem>
                  </>
                )}

                {!user ? (
                  <></>
                ) : (
                  <>
                    {" "}
                    {!user.isAdmin ? (
                      <></>
                    ) : (
                      <>
                        <MenuItem>
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          >
                            Admin Dashboard
                          </Link>
                        </MenuItem>
                      </>
                    )}
                  </>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="space-y-1 px-2 pt-2 pb-3">
        {navbarItems.map((item, index) => (
          <div key={item._id}>
            {/* ✅ Link for Main Items */}
            <DisclosureButton
              as={Link}
              to={item.href}
              onClick={(e) => {
                if (!item.dropdown || item.dropdown.length === 0) {
                  close(); // ✅ Closes menu when clicking non-dropdown items
                } else {
                  e.preventDefault(); // ✅ Prevents default navigation for dropdown headers
                  setOpenDropdown(openDropdown === index ? null : index);
                }
              }}
              className={`block rounded-md px-3 py-2 text-base font-medium flex justify-between items-center ${
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item.name}
              {item.dropdown && item.dropdown.length > 0 && (
                <ChevronDown
                  className={`ml-2 w-4 h-4 transition-transform ${
                    openDropdown === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </DisclosureButton>

            {/* ✅ Dropdown Items */}
            {item.dropdown && openDropdown === index && (
              <div className="ml-4 space-y-1 border-l border-gray-600 pl-3">
                {item.dropdown.map((subItem) => (
                  <Link
                    key={subItem._id}
                    to={subItem.href}
                    className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm"
                    onClick={() => {
                      close(); // ✅ Close entire navbar when selecting an option
                    }}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
