import express from "express";
import playlistsController from "../controllers/playlistsController.js";
import authenticateToken from "../middlewares/auth.js";

const createPlaylistsRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const playlists = playlistsController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  router.post("/", playlists.createPlaylist);
  router.delete("/:playlist_id", playlists.deletePlaylist);
  router.get("/", playlists.getUserPlaylists);
  router.post("/:playlist_id/movies", playlists.addMovieToPlaylist);
  router.delete("/:playlist_id/movies/:tmdb_id", playlists.removeMovieFromPlaylist);
  router.get("/:playlist_id/movies", playlists.getPlaylistMovies);

  return router;
};

export default createPlaylistsRouter;
