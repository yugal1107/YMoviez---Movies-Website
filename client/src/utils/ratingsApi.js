import { fetchData } from "./fetchData";

export const ratingsApi = {
  // Add or update a rating for a movie
  addOrUpdateRating: async (tmdb_id, rating) => {
    const response = await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/ratings`,
      {
        method: "POST",
        body: { tmdb_id, rating },
      }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to add or update rating");
  },

  // Get user's rating for a specific movie
  getUserRating: async (tmdb_id) => {
    const response = await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/ratings/user/${tmdb_id}`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to get user rating");
  },

  // Get movie ratings statistics
  getMovieRatings: async (tmdb_id) => {
    const response = await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/ratings/movie/${tmdb_id}`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to get movie ratings");
  },
};
