const ratingsController = (pool, getOrCreateMovie) => ({
  addOrUpdateRating: async (req, res) => {
    const { tmdb_id, rating } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      return res.status(400).json({ error: "Invalid or missing tmdb_id" });
    }

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const movie = await getOrCreateMovie(tmdb_id, client);
      const movie_id = movie.movie_id;

      const upsertQuery = `
        INSERT INTO ratings (user_id, movie_id, rating, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, movie_id)
        DO UPDATE SET rating = EXCLUDED.rating, created_at = NOW()
        RETURNING rating_id, rating, created_at;
      `;
      const values = [user_id, movie_id, rating];
      const result = await client.query(upsertQuery, values);

      await client.query("COMMIT");
      res.status(200).json({
        message: "Rating saved",
        rating: result.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error saving rating:", error.message, error.stack);
      res.status(500).json({
        error: "Failed to save rating",
        details: error.message,
      });
    } finally {
      client.release();
    }
  },

  getUserRating: async (req, res) => {
    const { tmdb_id } = req.params;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
      return res.status(400).json({ error: "Invalid TMDB ID" });
    }

    try {
      const query = `
        SELECT r.rating, r.created_at
        FROM ratings r
        JOIN movies m ON r.movie_id = m.movie_id
        WHERE r.user_id = $1 AND m.tmdb_id = $2;
      `;
      const result = await pool.query(query, [user_id, parseInt(tmdb_id)]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: "No rating found" });
      }
    } catch (error) {
      console.error("Error fetching user rating:", error.message, error.stack);
      res.status(500).json({
        error: "Failed to fetch rating",
        details: error.message,
      });
    }
  },

  getMovieRatings: async (req, res) => {
    const { tmdb_id } = req.params;

    if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
      return res.status(400).json({ error: "Invalid TMDB ID" });
    }

    try {
      const movieResult = await pool.query(
        "SELECT movie_id FROM movies WHERE tmdb_id = $1",
        [parseInt(tmdb_id)]
      );
      if (movieResult.rows.length === 0) {
        // If movie is not in our DB, it has no ratings
        return res.json({
          total_ratings: "0",
          average_rating: null,
        });
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
      res.json(result.rows[0]);
    } catch (error) {
      console.error(
        "Error fetching movie ratings:",
        error.message,
        error.stack
      );
      res.status(500).json({
        error: "Failed to fetch ratings",
        details: error.message,
      });
    }
  },
});

export default ratingsController;
