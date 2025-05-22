import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search box opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      navigate(`/search/${query}`);
      setQuery("");
      setIsOpen(false);

      // Small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Search movies"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {/* Search popup */}
      <div
        className={`absolute right-0 mt-2 w-screen max-w-sm transform transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="mx-2 sm:mx-0 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800 text-white pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Search movies..."
              disabled={isLoading}
            />

            {/* Clear button */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}

            {/* Search button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-0 top-0 h-full px-4 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800/40 disabled:text-gray-300 text-white transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </button>
          </form>

          {/* Quick search suggestions */}
          <div className="p-2 border-t border-gray-700">
            <p className="px-2 py-1 text-xs text-gray-400">Popular searches:</p>
            <div className="flex flex-wrap gap-2 p-2">
              {[
                "Final Destination",
                "Mission Impossible",
                "Stree 2",
                "Interstellar",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setTimeout(
                      () => handleSearch({ preventDefault: () => {} }),
                      10
                    );
                  }}
                  className="px-2 py-1 text-xs bg-gray-800 hover:bg-pink-600/30 text-gray-300 hover:text-pink-500 rounded transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
