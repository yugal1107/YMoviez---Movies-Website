const watchController = (pool, getOrCreateMovie) => ({
  setWatchStatus: async (req, res) => {
    // ...existing code from setWatchStatus in userController.js...
    const { tmdb_id, status } = req.body;
    const user_id = req.user.user_id;

    if (
      !tmdb_id ||
      !Number.isInteger(tmdb_id) ||
      !status ||
      !["watched", "want_to_watch"].includes(status)
    ) {
      return res.status(400).json({
        error:
          "Invalid tmdb_id or status. Status must be 'watched' or 'want_to_watch'",
      });
    }

    try {
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
      res.json({ message: "Watch status updated", ...result.rows[0] });
    } catch (error) {
      console.error("Error setting watch status:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to set watch status", details: error.message });
    }
  },

  getUserWatchStatus: async (req, res) => {
    // ...existing code from getUserWatchStatus in userController.js...
    const user_id = req.user.user_id;

    try {
      const query = `
        SELECT ws.movie_id, ws.status, ws.updated_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
        FROM watch_status ws
        JOIN movies m ON ws.movie_id = m.movie_id
        WHERE ws.user_id = $1
        ORDER BY ws.updated_at DESC;
      `;
      const result = await pool.query(query, [user_id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching watch status:", error.message, error.stack);
      res.status(500).json({
        error: "Failed to fetch watch status",
        details: error.message,
      });
    }
  },
});

export default watchController;
