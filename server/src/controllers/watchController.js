import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const watchController = (pool, getOrCreateMovie) => ({
  setWatchStatus: asyncHandler(async (req, res) => {
    const { tmdb_id, status } = req.body;
    const user_id = req.user.user_id;

    if (
      !tmdb_id ||
      !Number.isInteger(tmdb_id) ||
      !status ||
      !["watched", "want_to_watch"].includes(status)
    ) {
      throw new ApiError(
        400,
        "Invalid tmdb_id or status. Status must be 'watched' or 'want_to_watch'"
      );
    }

    const movie = await getOrCreateMovie(tmdb_id);
    const movie_id = movie.movie_id;

    const query = `
      INSERT INTO watch_status (user_id, movie_id, status, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET status = $3, updated_at = NOW()
      RETURNING watch_status_id, status, updated_at;
    `;
    const values = [user_id, movie_id, status];
    const result = await pool.query(query, values);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result.rows[0],
          "Watch status updated successfully"
        )
      );
  }),

  getUserWatchStatus: asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;

    const query = `
      SELECT ws.movie_id, ws.status, ws.updated_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
      FROM watch_status ws
      JOIN movies m ON ws.movie_id = m.movie_id
      WHERE ws.user_id = $1
      ORDER BY ws.updated_at DESC;
    `;
    const result = await pool.query(query, [user_id]);

    res
      .status(200)
      .json(
        new ApiResponse(200, result.rows, "User watch status fetched successfully")
      );
  }),
});

export default watchController;
