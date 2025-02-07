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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const navigation = [
  { name: "Image Resizers", href: "/resize", current: true },
  { name: "Crop Image", href: "/", current: false },
  {
    name: "Compress",

    current: false,
    dropdown: [
      { name: "MB to KB", href: "/resize" },
      { name: "JPG to PNG", href: "/compress/jpg-to-png" },
      { name: "WEBP to PNG", href: "/compress/webp-to-png" },
    ],
  },
  {
    name: "Convert",

    current: false,
    dropdown: [
      { name: "IMG to PDF", href: "/convert/img-to-pdf" },
      { name: "PDF to IMG", href: "/convert/pdf-to-img" },
      { name: "WEBP to PNG", href: "/convert/webp-to-png" },
    ],
  },
  { name: "Bulk Resize", href: "/bulk-resize", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const navigate = useNavigate(); // If using Next.js
  const [openDropdown, setOpenDropdown] = useState(false);

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
            <div className="hidden sm:ml-6 sm:block ">
              <div className="flex space-x-4  ">
                {navigation.map((item, index) => (
                  <div
                    key={item.name}
                    to={item.href}
                    onMouseEnter={() => item.dropdown && setOpenDropdown(index)}
                    onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                  >
                    {/* ✅ Use Link for Main Navigation Items */}
                    <div
                      to={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current ? "bg-gray-800 text-white" : "",
                        "hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium flex items-center"
                      )}
                    >
                      {" "}
                      {/* Main Navigation Items */}
                      <button
                        onClick={() => !item.dropdown && navigate(item.href)}
                        className="bg-gray-800  text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center"
                      >
                        {item.name}
                        {item.dropdown && (
                          <ChevronDown
                            className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                              openDropdown === index ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                    {/* Dropdown List for "Convert" */}
                    {item.dropdown && openDropdown === index && (
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
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

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
                <MenuItem>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </Link>
                </MenuItem>
                
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="space-y-1 px-2 pt-2 pb-3">
        {navigation.map((item, index) => (
          <div key={item.name}>
            {/* ✅ Link for Main Items */}
            <DisclosureButton
              as={Link}
              to={item.href}
              // aria-current={item.current ? "page" : undefined}
              onClick={(e) => {
                if (!item.dropdown)
                  close(); // ✅ Closes menu when clicking non-dropdown items
                else 
                e.preventDefault(); // ✅ Prevents default navigation for dropdown headers
              setOpenDropdown(openDropdown === index ? null : index);
              }}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium flex justify-between items-center"
              )}
            >
              {item.name}
              {item.dropdown && (
                <ChevronDown
                  className={`ml-2 w-4 h-4 transition-transform ${
                    openDropdown === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </DisclosureButton>

            {/* ✅ Dropdown Items */}
            {item.dropdown && openDropdown === index && (
              <div className="ml-4 space-y-1">
                {item.dropdown.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm"
                    onClick={(e) => e.stopPropagation()} // ✅ Prevents closing dropdown when clicking inside
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
