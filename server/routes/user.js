import express from "express";
import authenticateToken from "../middlewares/auth.js";
import pool from "../config/db.js";

const router = express.Router();

// Middleware to ensure all routes are authenticated
router.use(authenticateToken);

// Likes: Add a like
router.post("/likes", async (req, res) => {
  const { tmdb_id } = req.body;
  const user_id = req.user.user_id;

  if (!tmdb_id || !Number.isInteger(tmdb_id)) {
    return res.status(400).json({ error: "Invalid or missing tmdb_id" });
  }

  try {
    const query = `
      INSERT INTO likes (user_id, tmdb_id, liked_at)
      VALUES ($1, $2, NOW())
      RETURNING like_id;
    `;
    const values = [user_id, tmdb_id];
    const result = await pool.query(query, values);
    res.status(201).json({ message: "Movie liked", like_id: result.rows[0].like_id });
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation
      return res.status(409).json({ error: "Movie already liked" });
    }
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Failed to add like" });
  }
});

// Likes: Remove a like
router.delete("/likes/:tmdb_id", async (req, res) => {
  const { tmdb_id } = req.params;
  const user_id = req.user.user_id;

  if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
    return res.status(400).json({ error: "Invalid tmdb_id" });
  }

  try {
    const query = `
      DELETE FROM likes
      WHERE user_id = $1 AND tmdb_id = $2
      RETURNING *;
    `;
    const values = [user_id, parseInt(tmdb_id)];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Like not found" });
    }
    res.json({ message: "Like removed" });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ error: "Failed to remove like" });
  }
});

// Likes: Get user's likes
router.get("/likes", async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const query = `
      SELECT tmdb_id, liked_at
      FROM likes
      WHERE user_id = $1
      ORDER BY liked_at DESC;
    `;
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

// Playlists: Create a playlist
router.post("/playlists", async (req, res) => {
  const { name } = req.body;
  const user_id = req.user.user_id;

  if (!name || typeof name !== "string" || name.length > 100) {
    return res.status(400).json({ error: "Invalid or missing playlist name" });
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
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

// Playlists: Get user's playlists
router.get("/playlists", async (req, res) => {
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
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Playlists: Add a movie to a playlist
router.post("/playlists/:playlist_id/movies", async (req, res) => {
  const { playlist_id } = req.params;
  const { tmdb_id } = req.body;
  const user_id = req.user.user_id;

  if (!playlist_id || !Number.isInteger(parseInt(playlist_id)) || !tmdb_id || !Number.isInteger(tmdb_id)) {
    return res.status(400).json({ error: "Invalid playlist_id or tmdb_id" });
  }

  try {
    // Verify playlist belongs to the user
    const playlistQuery = `
      SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
    `;
    const playlistResult = await pool.query(playlistQuery, [parseInt(playlist_id), user_id]);
    if (playlistResult.rowCount === 0) {
      return res.status(403).json({ error: "Playlist not found or not owned by user" });
    }

    const query = `
      INSERT INTO playlist_movies (playlist_id, tmdb_id, added_at)
      VALUES ($1, $2, NOW())
      RETURNING playlist_movie_id;
    `;
    const values = [parseInt(playlist_id), tmdb_id];
    const result = await pool.query(query, values);
    res.status(201).json({ message: "Movie added to playlist", playlist_movie_id: result.rows[0].playlist_movie_id });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Movie already in playlist" });
    }
    console.error("Error adding movie to playlist:", error);
    res.status(500).json({ error: "Failed to add movie to playlist" });
  }
});

// Playlists: Remove a movie from a playlist
router.delete("/playlists/:playlist_id/movies/:tmdb_id", async (req, res) => {
  const { playlist_id, tmdb_id } = req.params;
  const user_id = req.user.user_id;

  if (!playlist_id || !Number.isInteger(parseInt(playlist_id)) || !tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
    return res.status(400).json({ error: "Invalid playlist_id or tmdb_id" });
  }

  try {
    // Verify playlist belongs to the user
    const playlistQuery = `
      SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
    `;
    const playlistResult = await pool.query(playlistQuery, [parseInt(playlist_id), user_id]);
    if (playlistResult.rowCount === 0) {
      return res.status(403).json({ error: "Playlist not found or not owned by user" });
    }

    const query = `
      DELETE FROM playlist_movies
      WHERE playlist_id = $1 AND tmdb_id = $2
      RETURNING *;
    `;
    const values = [parseInt(playlist_id), parseInt(tmdb_id)];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found in playlist" });
    }
    res.json({ message: "Movie removed from playlist" });
  } catch (error) {
    console.error("Error removing movie from playlist:", error);
    res.status(500).json({ error: "Failed to remove movie from playlist" });
  }
});

// Watch Status: Set watch status
router.post("/watch-status", async (req, res) => {
  const { tmdb_id, status } = req.body;
  const user_id = req.user.user_id;

  if (!tmdb_id || !Number.isInteger(tmdb_id) || !status || !["watched", "want_to_watch"].includes(status)) {
    return res.status(400).json({ error: "Invalid tmdb_id or status. Status must be 'watched' or 'want_to_watch'" });
  }

  try {
    const query = `
      INSERT INTO watch_status (user_id, tmdb_id, status, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, tmdb_id)
      DO UPDATE SET status = $3, updated_at = NOW()
      RETURNING watch_status_id, status, updated_at;
    `;
    const values = [user_id, tmdb_id, status];
    const result = await pool.query(query, values);
    res.json({ message: "Watch status updated", ...result.rows[0] });
  } catch (error) {
    console.error("Error setting watch status:", error);
    res.status(500).json({ error: "Failed to set watch status" });
  }
});

// Watch Status: Get user's watch statuses
router.get("/watch-status", async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const query = `
      SELECT tmdb_id, status, updated_at
      FROM watch_status
      WHERE user_id = $1
      ORDER BY updated_at DESC;
    `;
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching watch status:", error);
    res.status(500).json({ error: "Failed to fetch watch status" });
  }
});

// Recently Visited: Log a visit
router.post("/recently-visited", async (req, res) => {
  const { tmdb_id } = req.body;
  const user_id = req.user.user_id;

  if (!tmdb_id || !Number.isInteger(tmdb_id)) {
    return res.status(400).json({ error: "Invalid or missing tmdb_id" });
  }

  try {
    const query = `
      INSERT INTO recently_visited (user_id, tmdb_id, visited_at)
      VALUES ($1, $2, NOW())
      RETURNING visit_id, visited_at;
    `;
    const values = [user_id, tmdb_id];
    const result = await pool.query(query, values);
    res.status(201).json({ message: "Visit logged", ...result.rows[0] });
  } catch (error) {
    console.error("Error logging visit:", error);
    res.status(500).json({ error: "Failed to log visit" });
  }
});

// Recently Visited: Get recent visits (limit to 10 most recent)
router.get("/recently-visited", async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const query = `
      SELECT tmdb_id, visited_at
      FROM recently_visited
      WHERE user_id = $1
      ORDER BY visited_at DESC
      LIMIT 10;
    `;
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recent visits:", error);
    res.status(500).json({ error: "Failed to fetch recent visits" });
  }
});

// Test route (kept for debugging)
router.get("/test", (req, res) => {
  res.json({ message: "Authenticated!", user_id: req.user.user_id });
});

export default router;