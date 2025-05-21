import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  FilmIcon,
  HomeIcon,
  InfoIcon,
  TrendingUp,
  Heart,
  Clock,
  Star,
  Film,
} from "lucide-react";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const MobileMenu = ({ user, onClose, onLogout }) => {
  const [query, setQuery] = useState("");
  const [showGenres, setShowGenres] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  // Animation effect
  useEffect(() => {
    setAnimateIn(true);
    return () => setAnimateIn(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      onClose();
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  // Animation classes for menu entry
  const menuClasses = `md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto ${
    animateIn ? "animate-in fade-in slide-in-from-bottom duration-300" : ""
  }`;

  // Quick links with most popular categories/features
  const quickLinks = [
    { name: "Trending", icon: <TrendingUp size={16} />, path: "/genre/28" },
    { name: "Popular", icon: <Star size={16} />, path: "/genre/12" },
    { name: "New Releases", icon: <Clock size={16} />, path: "/genre/14" },
    { name: "My Favorites", icon: <Heart size={16} />, path: "/genre/10749" },
  ];

  return (
    <div className={menuClasses}>
      {/* Header with close button */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-800 bg-black/90 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
          <FilmIcon className="h-7 w-7 text-pink-500" />
          <h2 className="text-2xl font-bold text-white">YMoviez</h2>
        </Link>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 active:bg-pink-900/30 transition-colors"
        >
          <XMarkIcon className="h-6 w-6 text-gray-300" />
        </button>
      </div>

      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pb-24">
        {/* Search bar with pulse animation */}
        <div className="p-5 animate-in fade-in slide-in-from-bottom duration-500 delay-150">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-gray-800 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
              autoFocus
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-600 text-white px-3 py-1 rounded-md text-sm disabled:bg-gray-700 disabled:text-gray-400 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Links Section */}
        <div className="px-5 py-3 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(link.path)}
                className="flex items-center space-x-2 p-3 bg-gray-800/50 hover:bg-pink-500/20 hover:text-pink-400 rounded-lg text-gray-300 transition-colors"
              >
                <span className="p-1 bg-gray-700 rounded-md">{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Nav links */}
        <nav className="px-5 py-3 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
            Navigation
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white group transition-colors"
              >
                <HomeIcon className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowGenres(!showGenres)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white group transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <FilmIcon className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                  <span>Categories</span>
                </span>
                <ChevronRightIcon
                  className={`h-5 w-5 transition-transform duration-300 ${
                    showGenres ? "rotate-90 text-pink-500" : ""
                  }`}
                />
              </button>

              {/* Genres dropdown with animation */}
              {showGenres && (
                <div className="mt-2 pl-6 pr-2 grid grid-cols-2 gap-2 animate-in slide-in-from-top-5 duration-300">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleNavigate(`/genre/${genre.id}`)}
                      className="px-3 py-2.5 text-sm bg-gray-800/30 hover:bg-pink-600/20 text-gray-300 hover:text-pink-400 rounded-lg text-left transition-all hover:translate-x-0.5"
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link
                to="/playlists"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white group transition-colors"
              >
                <Film className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                <span>Playlists</span>
              </Link>
            </li>
            <li>
              <a
                href="https://yugal.tech"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white group transition-colors"
              >
                <InfoIcon className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                <span>About Dev</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* User section with improved styling */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-black/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom duration-500 delay-500">
        {user ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3 px-2">
              <div className="bg-pink-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                {user.displayName?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase() ||
                  "?"}
              </div>
              <div className="text-gray-300 flex-1 truncate">
                <div className="text-sm">Signed in as</div>
                <div className="text-pink-400 font-medium truncate">
                  {user.displayName || user.email}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors active:scale-[0.98] transform"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg text-center hover:from-pink-700 hover:to-purple-700 transition-colors active:scale-[0.98] transform"
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
