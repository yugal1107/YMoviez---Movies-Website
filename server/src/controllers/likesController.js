import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const likesController = (pool, getOrCreateMovie) => ({
  addLike: asyncHandler(async (req, res) => {
    const { tmdb_id } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      throw new ApiError(400, "Invalid or missing tmdb_id");
    }

    try {
      const movie = await getOrCreateMovie(tmdb_id);
      const movie_id = movie.movie_id;

      const query = `
        INSERT INTO likes (user_id, movie_id, liked_at)
        VALUES ($1, $2, NOW())
        RETURNING like_id;
      `;
      const values = [user_id, movie_id];
      const result = await pool.query(query, values);

      res
        .status(201)
        .json(
          new ApiResponse(201, { like_id: result.rows[0].like_id }, "Movie liked successfully")
        );
    } catch (error) {
      if (error.code === "23505") {
        throw new ApiError(409, "Movie already liked");
      }
      // The asyncHandler will catch any other errors and pass them to the global handler
      throw error;
    }
  }),

  removeLike: asyncHandler(async (req, res) => {
    const { tmdb_id } = req.params;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
      throw new ApiError(400, "Invalid tmdb_id");
    }

    const movie = await getOrCreateMovie(parseInt(tmdb_id));
    const movie_id = movie.movie_id;

    const query = `
      DELETE FROM likes
      WHERE user_id = $1 AND movie_id = $2
      RETURNING *;
    `;
    const values = [user_id, movie_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new ApiError(404, "Like not found");
    }

    res.status(200).json(new ApiResponse(200, {}, "Like removed successfully"));
  }),

  getUserLikes: asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;

    const query = `
      SELECT l.movie_id, l.liked_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
      FROM likes l
      JOIN movies m ON l.movie_id = m.movie_id
      WHERE l.user_id = $1
      ORDER BY l.liked_at DESC;
    `;
    const result = await pool.query(query, [user_id]);

    res
      .status(200)
      .json(new ApiResponse(200, result.rows, "User likes fetched successfully"));
  }),
});

export default likesController;
