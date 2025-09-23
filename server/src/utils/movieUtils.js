import pool from "../config/db.js";
import { getOrCreateMovie as getOrCreateMovieService } from "../services/movie.service.js";

/**
 * Finds a movie in the local database by its TMDB ID.
 * If the movie doesn't exist, it fetches details from the TMDB API,
 * creates a new entry in the local database, and returns the new movie object.
 * This function is a proxy to the centralized getOrCreateMovieService.
 *
 * @param {number} tmdb_id - The TMDB ID of the movie.
 * @param {object} [dbClient=pool] - Optional database client for transactions.
 * @returns {Promise<{movie_id: number}>} - The movie object with internal movie_id from your database.
 */
export const getOrCreateMovie = async (tmdb_id, dbClient = pool) => {
  // This utility function now delegates to the centralized service.
  return getOrCreateMovieService(tmdb_id, dbClient);
};
