const visitController = (pool, getOrCreateMovie) => ({
  logVisit: async (req, res) => {
    // ...existing code from logVisit in userController.js...
    const { tmdb_id } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      return res.status(400).json({ error: "Invalid or missing tmdb_id" });
    }

    try {
      const movie = await getOrCreateMovie(tmdb_id);
      const movie_id = movie.movie_id;

      const query = `
        INSERT INTO recently_visited (user_id, movie_id, visited_at)
        VALUES ($1, $2, NOW())
        RETURNING visit_id, visited_at;
      `;
      const values = [user_id, movie_id];
      const result = await pool.query(query, values);
      res.status(201).json({ message: "Visit logged", ...result.rows[0] });
    } catch (error) {
      console.error("Error logging visit:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to log visit", details: error.message });
    }
  },

  getRecentVisits: async (req, res) => {
    // ...existing code from getRecentVisits in userController.js...
    const user_id = req.user.user_id;

    try {
      const query = `
        SELECT rv.movie_id, rv.visited_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
        FROM recently_visited rv
        JOIN movies m ON rv.movie_id = m.movie_id
        WHERE rv.user_id = $1
        ORDER BY rv.visited_at DESC
        LIMIT 10;
      `;
      const result = await pool.query(query, [user_id]);
      res.json(result.rows);
    } catch (error) {
      console.error(
        "Error fetching recent visits:",
        error.message,
        error.stack
      );
      res.status(500).json({
        error: "Failed to fetch recent visits",
        details: error.message,
      });
    }
  },
});

export default visitController;
