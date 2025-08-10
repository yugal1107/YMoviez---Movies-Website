import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useSearch from "../../hooks/useSearch";
import SearchSuggestions from "../SearchSuggestions";
import {
  addToSearchHistory,
  getSearchHistory,
} from "../../utils/searchHistory";

const MobileSearchBox = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Use the custom search hook
  const {
    query,
    suggestions,
    showSuggestions,
    isLoadingSuggestions,
    handleQueryChange,
    clearSearch,
    hideSuggestions,
    showSuggestionsDropdown,
    setQuery,
  } = useSearch();

  // Focus input when search box opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches when component mounts
  useEffect(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = (movie) => {
    const searchTerm = movie.title || movie.name;
    if (movie.id) {
      // If it's a movie suggestion, navigate to movie page
      navigate(`/movie/${movie.id}`);
    } else {
      // If it's a search term, navigate to search results
      navigate(`/search/${searchTerm}`);
    }

    // Add to search history
    addToSearchHistory(searchTerm);
    setRecentSearches(getSearchHistory());

    // Clear and close search
    clearSearch();
    onClose();
  };

  // Handle view all results
  const handleViewAllResults = (searchQuery) => {
    navigate(`/search/${searchQuery}`);
    addToSearchHistory(searchQuery);
    setRecentSearches(getSearchHistory());
    clearSearch();
    onClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      navigate(`/search/${query}`);
      addToSearchHistory(query);
      setRecentSearches(getSearchHistory());
      clearSearch();
      onClose();

      // Small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    handleQueryChange(value);
    if (value.length >= 2) {
      showSuggestionsDropdown();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query.length >= 2) {
      showSuggestionsDropdown();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
      <div className="bg-gray-900 w-full h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white mr-3"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <h2 className="text-white font-semibold">Search Movies</h2>
        </div>

        {/* Search Form */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="w-full bg-gray-800 text-white pl-4 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Search movies..."
              disabled={isLoading}
            />

            {/* Clear button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  clearSearch();
                  hideSuggestions();
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}

            {/* Search button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800/40 disabled:text-gray-300 text-white rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>

        {/* Search Suggestions */}
        <div className="flex-1 overflow-hidden">
          <SearchSuggestions
            suggestions={suggestions}
            isLoading={isLoadingSuggestions}
            query={query}
            onSuggestionClick={handleSuggestionClick}
            onViewAllResults={handleViewAllResults}
            recentSearches={recentSearches}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBox;
