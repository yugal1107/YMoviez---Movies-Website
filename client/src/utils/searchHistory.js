/**
 * Utility functions for managing search history in localStorage
 */

const STORAGE_KEY = "movie_search_history";
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from localStorage
 * @returns {string[]} Array of search terms
 */
export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting search history:", error);
    return [];
  }
};

/**
 * Add a search term to history
 * @param {string} searchTerm - The search term to add
 */
export const addToSearchHistory = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== "string") return;

  try {
    const history = getSearchHistory();

    // Remove the term if it already exists to avoid duplicates
    const filteredHistory = history.filter(
      (term) => term.toLowerCase() !== searchTerm.toLowerCase()
    );

    // Add the new term at the beginning
    const newHistory = [searchTerm.trim(), ...filteredHistory].slice(
      0,
      MAX_HISTORY_ITEMS
    ); // Limit the number of items

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error adding to search history:", error);
  }
};

/**
 * Remove a specific term from search history
 * @param {string} searchTerm - The search term to remove
 */
export const removeFromSearchHistory = (searchTerm) => {
  try {
    const history = getSearchHistory();
    const newHistory = history.filter(
      (term) => term.toLowerCase() !== searchTerm.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error removing from search history:", error);
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};
