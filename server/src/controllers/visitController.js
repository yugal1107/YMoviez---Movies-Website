import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const visitController = (pool, getOrCreateMovie) => ({
  logVisit: asyncHandler(async (req, res) => {
    const { tmdb_id } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      throw new ApiError(400, "Invalid or missing tmdb_id");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const movie = await getOrCreateMovie(tmdb_id, client);

      const upsertQuery = `
        INSERT INTO recently_visited (user_id, movie_id, visited_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id, movie_id)
        DO UPDATE SET visited_at = NOW()
        RETURNING visit_id, visited_at;
      `;
      const values = [user_id, movie.movie_id];
      const result = await client.query(upsertQuery, values);

      await client.query("COMMIT");

      res
        .status(200)
        .json(new ApiResponse(200, result.rows[0], "Visit logged successfully"));
    } catch (error) {
      await client.query("ROLLBACK");
      // Re-throw the error to be caught by asyncHandler
      throw new ApiError(500, `Failed to log visit: ${error.message}`);
    } finally {
      client.release();
    }
  }),

  getRecentVisits: asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;

    const query = `
      SELECT rv.movie_id, rv.visited_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
      FROM recently_visited rv
      JOIN movies m ON rv.movie_id = m.movie_id
      WHERE rv.user_id = $1
      ORDER BY rv.visited_at DESC
      LIMIT 10;
    `;
    const result = await pool.query(query, [user_id]);

    res
      .status(200)
      .json(
        new ApiResponse(200, result.rows, "Recent visits fetched successfully")
      );
  }),
});

export default visitController;
