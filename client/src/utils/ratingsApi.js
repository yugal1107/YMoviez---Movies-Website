import { fetchData } from "./fetchData";

export const ratingsApi = {
  // Add or update a rating for a movie
  addOrUpdateRating: async (tmdb_id, rating) => {
    return await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/user/ratings`,
      {
        method: "POST",
        body: { tmdb_id, rating },
      }
    );
  },

  // Get user's rating for a specific movie
  getUserRating: async (tmdb_id) => {
    return await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/user/ratings/${tmdb_id}`
    );
  },

  // Get movie ratings statistics
  getMovieRatings: async (tmdb_id) => {
    return await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/user/ratings/movie/${tmdb_id}`
    );
  },
};
