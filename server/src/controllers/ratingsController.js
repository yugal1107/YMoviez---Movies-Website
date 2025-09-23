import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const ratingsController = (pool, getOrCreateMovie) => ({
  addOrUpdateRating: asyncHandler(async (req, res) => {
    const { tmdb_id, rating } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      throw new ApiError(400, "Invalid or missing tmdb_id");
    }

    const intRating = parseInt(rating, 10);
    if (isNaN(intRating) || intRating < 1 || intRating > 10) {
      throw new ApiError(400, "Rating must be an integer between 1 and 10");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const movie = await getOrCreateMovie(tmdb_id, client);

      const upsertQuery = `
        INSERT INTO ratings (user_id, movie_id, rating, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, movie_id)
        DO UPDATE SET rating = EXCLUDED.rating, created_at = NOW()
        RETURNING rating_id, rating, created_at;
      `;
      const values = [user_id, movie.movie_id, intRating];
      const result = await client.query(upsertQuery, values);

      await client.query("COMMIT");
      res
        .status(200)
        .json(new ApiResponse(200, result.rows[0], "Rating saved successfully"));
    } catch (error) {
      await client.query("ROLLBACK");
      throw new ApiError(500, `Failed to save rating: ${error.message}`);
    } finally {
      client.release();
    }
  }),

  getUserRating: asyncHandler(async (req, res) => {
    const { tmdb_id } = req.params;
    const user_id = req.user.user_id;
    const intTmdbId = parseInt(tmdb_id, 10);

    if (isNaN(intTmdbId)) {
      throw new ApiError(400, "Invalid TMDB ID");
    }

    const query = `
      SELECT r.rating, r.created_at
      FROM ratings r
      JOIN movies m ON r.movie_id = m.movie_id
      WHERE r.user_id = $1 AND m.tmdb_id = $2;
    `;
    const result = await pool.query(query, [user_id, intTmdbId]);

    if (result.rows.length === 0) {
      throw new ApiError(404, "No rating found for this user and movie");
    }

    res
      .status(200)
      .json(new ApiResponse(200, result.rows[0], "User rating fetched successfully"));
  }),

  getMovieRatings: asyncHandler(async (req, res) => {
    const { tmdb_id } = req.params;
    const intTmdbId = parseInt(tmdb_id, 10);

    if (isNaN(intTmdbId)) {
      throw new ApiError(400, "Invalid TMDB ID");
    }

    const movieResult = await pool.query(
      "SELECT movie_id FROM movies WHERE tmdb_id = $1",
      [intTmdbId]
    );

    if (movieResult.rows.length === 0) {
      // If movie is not in our DB, it has no ratings
      return res.status(200).json(
        new ApiResponse(
          200,
          { total_ratings: "0", average_rating: null },
          "Movie has not been rated yet"
        )
      );
    }
    const movieId = movieResult.rows[0].movie_id;

    const query = `
      SELECT
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating
      FROM ratings
      WHERE movie_id = $1;
    `;
    const result = await pool.query(query, [movieId]);

    res
      .status(200)
      .json(new ApiResponse(200, result.rows[0], "Movie ratings fetched successfully"));
  }),
});

export default ratingsController;
