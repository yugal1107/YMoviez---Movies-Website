const playlistsController = (pool, getOrCreateMovie) => ({
  createPlaylist: async (req, res) => {
    // ...existing code from createPlaylist in userController.js...
    const { name } = req.body;
    const user_id = req.user.user_id;

    if (!name || typeof name !== "string" || name.length > 100) {
      return res
        .status(400)
        .json({ error: "Invalid or missing playlist name" });
    }

    try {
      const query = `
        INSERT INTO playlists (user_id, name, created_at)
        VALUES ($1, $2, NOW())
        RETURNING playlist_id, name, created_at;
      `;
      const values = [user_id, name];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating playlist:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to create playlist", details: error.message });
    }
  },

  deletePlaylist: async (req, res) => {
    // ...existing code from deletePlaylist in userController.js...
    const { playlist_id } = req.params;
    const user_id = req.user.user_id;

    if (!playlist_id || !Number.isInteger(parseInt(playlist_id))) {
      return res.status(400).json({ error: "Invalid playlist_id" });
    }

    try {
      // Verify playlist belongs to the user
      const playlistQuery = `
        SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
      `;
      const playlistResult = await pool.query(playlistQuery, [
        parseInt(playlist_id),
        user_id,
      ]);
      if (playlistResult.rowCount === 0) {
        return res
          .status(403)
          .json({ error: "Playlist not found or not owned by user" });
      }

      // Delete associated movies from playlist_movies
      await pool.query("DELETE FROM playlist_movies WHERE playlist_id = $1", [
        parseInt(playlist_id),
      ]);

      // Delete the playlist
      const deleteQuery = `
        DELETE FROM playlists
        WHERE playlist_id = $1 AND user_id = $2
        RETURNING *;
      `;
      const result = await pool.query(deleteQuery, [
        parseInt(playlist_id),
        user_id,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      res.json({ message: "Playlist deleted" });
    } catch (error) {
      console.error("Error deleting playlist:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to delete playlist", details: error.message });
    }
  },

  getUserPlaylists: async (req, res) => {
    // ...existing code from getUserPlaylists in userController.js...
    const user_id = req.user.user_id;

    try {
      const query = `
        SELECT playlist_id, name, created_at
        FROM playlists
        WHERE user_id = $1
        ORDER BY created_at DESC;
      `;
      const result = await pool.query(query, [user_id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching playlists:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Failed to fetch playlists", details: error.message });
    }
  },

  addMovieToPlaylist: async (req, res) => {
    // ...existing code from addMovieToPlaylist in userController.js...
    const { playlist_id } = req.params;
    const { tmdb_id } = req.body;
    const user_id = req.user.user_id;

    if (
      !playlist_id ||
      !Number.isInteger(parseInt(playlist_id)) ||
      !tmdb_id ||
      !Number.isInteger(tmdb_id)
    ) {
      return res.status(400).json({ error: "Invalid playlist_id or tmdb_id" });
    }

    try {
      const playlistQuery = `
        SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
      `;
      const playlistResult = await pool.query(playlistQuery, [
        parseInt(playlist_id),
        user_id,
      ]);
      if (playlistResult.rowCount === 0) {
        return res
          .status(403)
          .json({ error: "Playlist not found or not owned by user" });
      }

      const movie = await getOrCreateMovie(tmdb_id);
      const movie_id = movie.movie_id;

      const query = `
        INSERT INTO playlist_movies (playlist_id, movie_id, added_at)
        VALUES ($1, $2, NOW())
        RETURNING playlist_movie_id;
      `;
      const values = [parseInt(playlist_id), movie_id];
      const result = await pool.query(query, values);
      res.status(201).json({
        message: "Movie added to playlist",
        playlist_movie_id: result.rows[0].playlist_movie_id,
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Movie already in playlist" });
      }
      console.error(
        "Error adding movie to playlist:",
        error.message,
        error.stack
      );
      res.status(500).json({
        error: "Failed to add movie to playlist",
        details: error.message,
      });
    }
  },

  removeMovieFromPlaylist: async (req, res) => {
    // ...existing code from removeMovieFromPlaylist in userController.js...
    const { playlist_id, tmdb_id } = req.params;
    const user_id = req.user.user_id;

    if (
      !playlist_id ||
      !Number.isInteger(parseInt(playlist_id)) ||
      !tmdb_id ||
      !Number.isInteger(parseInt(tmdb_id))
    ) {
      return res.status(400).json({ error: "Invalid playlist_id or tmdb_id" });
    }

    try {
      const playlistQuery = `
        SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
      `;
      const playlistResult = await pool.query(playlistQuery, [
        parseInt(playlist_id),
        user_id,
      ]);
      if (playlistResult.rowCount === 0) {
        return res
          .status(403)
          .json({ error: "Playlist not found or not owned by user" });
      }

      const movie = await getOrCreateMovie(parseInt(tmdb_id));
      const movie_id = movie.movie_id;

      const query = `
        DELETE FROM playlist_movies
        WHERE playlist_id = $1 AND movie_id = $2
        RETURNING *;
      `;
      const values = [parseInt(playlist_id), movie_id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Movie not found in playlist" });
      }
      res.json({ message: "Movie removed from playlist" });
    } catch (error) {
      console.error(
        "Error removing movie from playlist:",
        error.message,
        error.stack
      );
      res.status(500).json({
        error: "Failed to remove movie from playlist",
        details: error.message,
      });
    }
  },

  getPlaylistMovies: async (req, res) => {
    // ...existing code from getPlaylistMovies in userController.js...
    const { playlist_id } = req.params;
    const user_id = req.user.user_id;

    if (!playlist_id || !Number.isInteger(parseInt(playlist_id))) {
      return res.status(400).json({ error: "Invalid playlist_id" });
    }

    try {
      const playlistQuery = `
        SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
      `;
      const playlistResult = await pool.query(playlistQuery, [
        parseInt(playlist_id),
        user_id,
      ]);
      if (playlistResult.rowCount === 0) {
        return res
          .status(403)
          .json({ error: "Playlist not found or not owned by user" });
      }

      const query = `
        SELECT pm.movie_id, pm.added_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
        FROM playlist_movies pm
        JOIN movies m ON pm.movie_id = m.movie_id
        WHERE pm.playlist_id = $1
        ORDER BY pm.added_at DESC;
      `;
      const result = await pool.query(query, [parseInt(playlist_id)]);
      res.json(result.rows);
    } catch (error) {
      console.error(
        "Error fetching playlist movies:",
        error.message,
        error.stack
      );
      res.status(500).json({
        error: "Failed to fetch playlist movies",
        details: error.message,
      });
    }
  },
});

export default playlistsController;
