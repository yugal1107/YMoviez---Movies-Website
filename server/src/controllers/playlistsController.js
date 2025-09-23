import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const playlistsController = (pool, getOrCreateMovie) => {
  // Helper to verify playlist ownership
  const verifyPlaylistOwner = async (playlist_id, user_id) => {
    const playlistQuery = `
      SELECT 1 FROM playlists WHERE playlist_id = $1 AND user_id = $2;
    `;
    const playlistResult = await pool.query(playlistQuery, [playlist_id, user_id]);
    if (playlistResult.rowCount === 0) {
      throw new ApiError(403, "Playlist not found or you do not have permission to access it.");
    }
  };

  return {
    createPlaylist: asyncHandler(async (req, res) => {
      const { name } = req.body;
      const user_id = req.user.user_id;

      if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
        throw new ApiError(400, "Invalid or missing playlist name");
      }

      const query = `
        INSERT INTO playlists (user_id, name, created_at)
        VALUES ($1, $2, NOW())
        RETURNING playlist_id, name, created_at;
      `;
      const values = [user_id, name.trim()];
      const result = await pool.query(query, values);

      res.status(201).json(new ApiResponse(201, result.rows[0], "Playlist created successfully"));
    }),

    deletePlaylist: asyncHandler(async (req, res) => {
      const { playlist_id } = req.params;
      const user_id = req.user.user_id;
      const intPlaylistId = parseInt(playlist_id, 10);

      if (isNaN(intPlaylistId)) {
        throw new ApiError(400, "Invalid playlist_id");
      }

      await verifyPlaylistOwner(intPlaylistId, user_id);

      // The database can be set up with cascading deletes, but doing it manually ensures atomicity if not.
      await pool.query("DELETE FROM playlist_movies WHERE playlist_id = $1", [intPlaylistId]);
      await pool.query("DELETE FROM playlists WHERE playlist_id = $1", [intPlaylistId]);

      res.status(200).json(new ApiResponse(200, {}, "Playlist deleted successfully"));
    }),

    getUserPlaylists: asyncHandler(async (req, res) => {
      const user_id = req.user.user_id;

      const query = `
        SELECT playlist_id, name, created_at
        FROM playlists
        WHERE user_id = $1
        ORDER BY created_at DESC;
      `;
      const result = await pool.query(query, [user_id]);

      res.status(200).json(new ApiResponse(200, result.rows, "Playlists fetched successfully"));
    }),

    addMovieToPlaylist: asyncHandler(async (req, res) => {
      const { playlist_id } = req.params;
      const { tmdb_id } = req.body;
      const user_id = req.user.user_id;
      const intPlaylistId = parseInt(playlist_id, 10);
      const intTmdbId = parseInt(tmdb_id, 10);

      if (isNaN(intPlaylistId) || isNaN(intTmdbId)) {
        throw new ApiError(400, "Invalid playlist_id or tmdb_id");
      }

      await verifyPlaylistOwner(intPlaylistId, user_id);
      const movie = await getOrCreateMovie(intTmdbId);

      try {
        const query = `
          INSERT INTO playlist_movies (playlist_id, movie_id, added_at)
          VALUES ($1, $2, NOW())
          RETURNING playlist_movie_id;
        `;
        const values = [intPlaylistId, movie.movie_id];
        const result = await pool.query(query, values);
        res.status(201).json(new ApiResponse(201, result.rows[0], "Movie added to playlist"));
      } catch (error) {
        if (error.code === "23505") {
          throw new ApiError(409, "Movie already in this playlist");
        }
        throw error; // Let asyncHandler handle it
      }
    }),

    removeMovieFromPlaylist: asyncHandler(async (req, res) => {
      const { playlist_id, tmdb_id } = req.params;
      const user_id = req.user.user_id;
      const intPlaylistId = parseInt(playlist_id, 10);
      const intTmdbId = parseInt(tmdb_id, 10);

      if (isNaN(intPlaylistId) || isNaN(intTmdbId)) {
        throw new ApiError(400, "Invalid playlist_id or tmdb_id");
      }

      await verifyPlaylistOwner(intPlaylistId, user_id);
      const movie = await getOrCreateMovie(intTmdbId);

      const query = `
        DELETE FROM playlist_movies
        WHERE playlist_id = $1 AND movie_id = $2;
      `;
      const values = [intPlaylistId, movie.movie_id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new ApiError(404, "Movie not found in this playlist");
      }

      res.status(200).json(new ApiResponse(200, {}, "Movie removed from playlist"));
    }),

    getPlaylistMovies: asyncHandler(async (req, res) => {
      const { playlist_id } = req.params;
      const user_id = req.user.user_id;
      const intPlaylistId = parseInt(playlist_id, 10);

      if (isNaN(intPlaylistId)) {
        throw new ApiError(400, "Invalid playlist_id");
      }

      await verifyPlaylistOwner(intPlaylistId, user_id);

      const query = `
        SELECT pm.movie_id, pm.added_at, m.tmdb_id, m.title, m.poster_path, m.vote_average
        FROM playlist_movies pm
        JOIN movies m ON pm.movie_id = m.movie_id
        WHERE pm.playlist_id = $1
        ORDER BY pm.added_at DESC;
      `;
      const result = await pool.query(query, [intPlaylistId]);

      res.status(200).json(new ApiResponse(200, result.rows, "Playlist movies fetched successfully"));
    }),
  };
};

export default playlistsController;
