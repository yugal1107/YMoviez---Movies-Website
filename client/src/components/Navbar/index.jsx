import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import SearchBox from "./SearchBox";
import MobileMenu from "./MobileMenu";
import { Button } from "@heroui/react";
import { FilmIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/authContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import ThemeSwitch from "./ThemeSwitch";

const Navbar = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // console.log(user); // For debugging purposes

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      console.log("Logged out successfully");
    });
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-sm"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-pink-500 hover:text-pink-400"
            >
              <FilmIcon className="h-8 w-8" />
              <span className="text-2xl font-bold hidden sm:block">
                YMoviez
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Dropdown />
              <Link
                to="https://yugal.tech"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                About Dev
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Only show SearchBox on md screens and above */}
            <div className="hidden md:block">
              <SearchBox />
            </div>
            {/* <ThemeSwitch /> */}

            {/* User authentication section */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-gray-300 text-sm">
                  {user.displayName || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                  size="sm"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Open mobile menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          user={user}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </nav>
  );
};

export default Navbar;
