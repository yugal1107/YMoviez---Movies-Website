import React from "react";
import { Link } from "react-router-dom";
import {
  FilmIcon,
  MagnifyingGlassIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const SearchSuggestions = ({
  suggestions = [],
  isLoading,
  query,
  onSuggestionClick,
  onViewAllResults,
  recentSearches = [],
  popularSearches = [
    "Final Destination",
    "Mission Impossible",
    "Stree 2",
    "Interstellar",
  ],
}) => {
  const handleSuggestionClick = (movie) => {
    if (onSuggestionClick) {
      onSuggestionClick(movie);
    }
  };

  const handleViewAllClick = () => {
    if (onViewAllResults) {
      onViewAllResults(query);
    }
  };

  const handlePopularSearchClick = (term) => {
    if (onSuggestionClick) {
      onSuggestionClick({ title: term, id: null });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="h-5 w-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-400 mt-2">Searching...</p>
      </div>
    );
  }

  // If no query, show recent and popular searches
  if (!query || query.length < 2) {
    return (
      <div className="p-2 border-t border-gray-700">
        {recentSearches.length > 0 && (
          <div className="mb-4">
            <p className="px-2 py-1 text-xs text-gray-400 flex items-center gap-2">
              <ClockIcon className="h-3 w-3" />
              Recent searches:
            </p>
            <div className="space-y-1">
              {recentSearches.slice(0, 3).map((term, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(term)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-2"
                >
                  <ClockIcon className="h-3 w-3" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="px-2 py-1 text-xs text-gray-400">Popular searches:</p>
          <div className="flex flex-wrap gap-2 p-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearchClick(term)}
                className="px-2 py-1 text-xs bg-gray-800 hover:bg-pink-600/30 text-gray-300 hover:text-pink-500 rounded transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show search suggestions
  if (suggestions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <FilmIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No suggestions found</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-700">
      {/* Movie suggestions */}
      <div className="max-h-80 overflow-y-auto">
        {suggestions.map((movie, index) => (
          <button
            key={movie.id || index}
            onClick={() => handleSuggestionClick(movie)}
            className="w-full text-left px-3 py-2 hover:bg-gray-700/50 transition-colors flex items-center gap-3 group"
          >
            <div className="flex-shrink-0">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-8 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-12 bg-gray-600 rounded flex items-center justify-center">
                  <FilmIcon className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-pink-400 truncate">
                {movie.title || movie.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A"}
                {movie.vote_average > 0 &&
                  ` • ${movie.vote_average.toFixed(1)}/10`}
              </p>
            </div>

            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-hover:text-pink-400" />
          </button>
        ))}
      </div>

      {/* View all results button */}
      {query && (
        <div className="border-t border-gray-700 p-2">
          <button
            onClick={handleViewAllClick}
            className="w-full px-3 py-2 text-sm text-pink-400 hover:text-pink-300 hover:bg-gray-700/30 rounded transition-colors flex items-center justify-center gap-2"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            View all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
