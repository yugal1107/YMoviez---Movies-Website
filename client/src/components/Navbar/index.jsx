import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import SearchBox from "./SearchBox";
import MobileMenu from "./MobileMenu";
import MobileSearchBox from "./MobileSearchBox";
import { Button } from "@heroui/react";
import {
  FilmIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/authContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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
              <Dropdown />
              <Link
                to="/playlists"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Playlists
              </Link>
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
            {/* Desktop Search - Only show on md screens and above */}
            <div className="hidden md:block">
              <SearchBox />
            </div>

            {/* Mobile Search Button - Only show on mobile */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open mobile search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* <ThemeSwitch /> */}

            {/* User authentication section */}
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
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

      {/* Mobile Search */}
      <MobileSearchBox
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
