import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchData";
import useDebounce from "./useDebounce";

/**
 * Custom hook for search functionality with debouncing
 * @param {number} debounceDelay - Delay for debouncing search queries (default: 300ms)
 * @param {number} minQueryLength - Minimum query length to trigger search (default: 2)
 * @returns {object} Search state and functions
 */
const useSearch = (debounceDelay = 300, minQueryLength = 2) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(query, debounceDelay);

  // Fetch suggestions from API
  const {
    data: searchResults,
    isLoading: isLoadingSuggestions,
    error,
  } = useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: () => fetchSearchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= minQueryLength,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Update suggestions when search results change
  useEffect(() => {
    if (searchResults) {
      setSuggestions(searchResults.results?.slice(0, 6) || []); // Limit to 6 suggestions
    }
  }, [searchResults]);

  // API call function
  const fetchSearchSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      return { results: [] };
    }

    try {
      const response = await fetchData(
        `${
          import.meta.env.VITE_BASE_API_URL
      }api/tmdb/search/movie?query=${encodeURIComponent(searchQuery)}&page=1`
      );
      return response;
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return { results: [] };
    }
  };

  // Handle query changes
  const handleQueryChange = useCallback(
    (newQuery) => {
      setQuery(newQuery);
      setShowSuggestions(newQuery.length >= minQueryLength);
    },
    [minQueryLength]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  // Hide suggestions
  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  // Show suggestions
  const showSuggestionsDropdown = useCallback(() => {
    setShowSuggestions(query.length >= minQueryLength);
  }, [query, minQueryLength]);

  return {
    query,
    suggestions,
    showSuggestions,
    isLoadingSuggestions,
    error,
    handleQueryChange,
    clearSearch,
    hideSuggestions,
    showSuggestionsDropdown,
    setQuery,
  };
};

export default useSearch;
