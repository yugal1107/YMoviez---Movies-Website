const likesController = (pool, getOrCreateMovie) => ({
  addLike: async (req, res) => {
    // ...existing code from addLike in userController.js...
    const { tmdb_id } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      return res.status(400).json({ error: "Invalid or missing tmdb_id" });
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
        .json({ message: "Movie liked", like_id: result.rows[0].like_id });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Movie already liked" });
      }
      console.error("Error adding like:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to add like", details: error.message });
    }
  },

  removeLike: async (req, res) => {
    // ...existing code from removeLike in userController.js...
    const { tmdb_id } = req.params;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
      return res.status(400).json({ error: "Invalid tmdb_id" });
    }

    try {
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
        return res.status(404).json({ error: "Like not found" });
      }
      res.json({ message: "Like removed" });
    } catch (error) {
      console.error("Error removing like:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to remove like", details: error.message });
    }
  },

  getUserLikes: async (req, res) => {
    // ...existing code from getUserLikes in userController.js...
    const user_id = req.user.user_id;

    try {
      const query = `
        SELECT l.movie_id, l.liked_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
        FROM likes l
        JOIN movies m ON l.movie_id = m.movie_id
        WHERE l.user_id = $1
        ORDER BY l.liked_at DESC;
      `;
      const result = await pool.query(query, [user_id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching likes:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to fetch likes", details: error.message });
    }
  },
});

export default likesController;
