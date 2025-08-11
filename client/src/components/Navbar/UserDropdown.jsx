import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  HeartIcon,
  EyeIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const UserDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Liked Movies", href: "/liked", icon: HeartIcon },
    { name: "Watched", href: "/watched", icon: EyeIcon },
    { name: "Watchlist", href: "/watchlist", icon: BookmarkIcon },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <span>{user.displayName || user.email}</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-pink-500/20 hover:text-pink-400 rounded-md transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="my-1 border-t border-gray-700" />
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
