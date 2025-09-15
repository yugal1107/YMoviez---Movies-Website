import pool from "../config/db.js";
import axios from "axios";

/**
 * Finds a movie in the local database by its TMDB ID.
 * If the movie doesn't exist, it fetches details from the TMDB API,
 * creates a new entry in the local database, and returns the new movie object.
 *
 * @param {number} tmdb_id - The TMDB ID of the movie.
 * @param {object} [dbClient=pool] - Optional database client for transactions.
 * @returns {Promise<{movie_id: number}>} - The movie object with internal movie_id from your database.
 */
export const getOrCreateMovie = async (tmdb_id, dbClient = pool) => {
  // 1. Check if the movie already exists in our database
  let movieResult = await dbClient.query(
    "SELECT movie_id FROM movies WHERE tmdb_id = $1",
    [tmdb_id]
  );

  if (movieResult.rows.length > 0) {
    // 2. If it exists, return its internal ID
    return movieResult.rows[0];
  } else {
    // 3. If not, fetch it from the TMDB API
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}`
    );
    const movieData = response.data;

    // 4. Insert the new movie into our database
    const newMovieResult = await dbClient.query(
      "INSERT INTO movies (tmdb_id, title, poster_path, vote_average) VALUES ($1, $2, $3, $4) RETURNING movie_id",
      [
        movieData.id,
        movieData.title,
        movieData.poster_path,
        movieData.vote_average,
      ]
    );

    // 5. Return the newly created movie object
    return newMovieResult.rows[0];
  }
};
