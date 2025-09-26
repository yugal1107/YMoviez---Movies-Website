import pool from "../config/db.js";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

const getOrCreateMovie = async (tmdb_id, dbClient = pool) => {
  // Validate that the access token is present before making an API call
  const accessToken = process.env.ACCESS_TOKEN_AUTH;
  if (!accessToken) {
    throw new ApiError(500, "Server Configuration Error: TMDB access token is missing.");
  }

  try {
    // Check if the movie already exists
    const movieQuery = `
      SELECT movie_id, title, poster_path, vote_average
      FROM movies
      WHERE tmdb_id = $1;
    `;
    const movieResult = await dbClient.query(movieQuery, [tmdb_id]);
    if (movieResult.rows.length > 0) {
      return movieResult.rows[0];
    }

    // Fetch movie details from TMDB API using axios
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}`;
    const response = await axios.get(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 5000, // 5-second timeout
    });

    const movieData = response.data;

    // Insert the movie into the movies table
    const insertQuery = `
      INSERT INTO movies (tmdb_id, title, poster_path, vote_average, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING movie_id, title, poster_path, vote_average;
    `;
    const insertValues = [
      tmdb_id,
      movieData.title,
      movieData.poster_path || null,
      movieData.vote_average || null,
    ];
    const insertResult = await dbClient.query(insertQuery, insertValues);
    return insertResult.rows[0];
  } catch (error) {
    // Throw a standardized error
    throw new ApiError(500, `Error in getOrCreateMovie: ${error.message}`);
  }
};

export { getOrCreateMovie };
