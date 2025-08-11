const visitController = (pool, getOrCreateMovie) => ({
  logVisit: async (req, res) => {
    const { tmdb_id } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      return res.status(400).json({ error: "Invalid or missing tmdb_id" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const movie = await getOrCreateMovie(tmdb_id, client);
      const movie_id = movie.movie_id;

      // Check if a recent visit for this user and movie already exists
      const existingVisitQuery = `
        SELECT visit_id FROM recently_visited
        WHERE user_id = $1 AND movie_id = $2;
      `;
      const existingVisitResult = await client.query(existingVisitQuery, [
        user_id,
        movie_id,
      ]);

      if (existingVisitResult.rows.length > 0) {
        // If it exists, update the timestamp
        const updateQuery = `
          UPDATE recently_visited
          SET visited_at = NOW()
          WHERE user_id = $1 AND movie_id = $2
          RETURNING visit_id, visited_at;
        `;
        const result = await client.query(updateQuery, [user_id, movie_id]);
        res
          .status(200)
          .json({ message: "Visit timestamp updated", ...result.rows[0] });
      } else {
        // If it doesn't exist, insert a new record
        const insertQuery = `
          INSERT INTO recently_visited (user_id, movie_id, visited_at)
          VALUES ($1, $2, NOW())
          RETURNING visit_id, visited_at;
        `;
        const result = await client.query(insertQuery, [user_id, movie_id]);
        res.status(201).json({ message: "Visit logged", ...result.rows[0] });
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error logging visit:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to log visit", details: error.message });
    } finally {
      client.release();
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
