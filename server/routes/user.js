import express from "express";
import authenticateToken from "../middlewares/auth.js";
import likesController from "../controllers/likesController.js";
import playlistsController from "../controllers/playlistsController.js";
import watchController from "../controllers/watchController.js";
import visitController from "../controllers/visitController.js";
import userController from "../controllers/userController.js";

const createUserRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();

  const likes = likesController(pool, getOrCreateMovie);
  const playlists = playlistsController(pool, getOrCreateMovie);
  const watch = watchController(pool, getOrCreateMovie);
  const visit = visitController(pool, getOrCreateMovie);
  const user = userController();

  router.use(authenticateToken);

  // Likes routes
  router.post("/likes", likes.addLike);
  router.delete("/likes/:tmdb_id", likes.removeLike);
  router.get("/likes", likes.getUserLikes);

  // Playlists routes
  router.post("/playlists", playlists.createPlaylist);
  router.delete("/playlists/:playlist_id", playlists.deletePlaylist);
  router.get("/playlists", playlists.getUserPlaylists);
  router.post("/playlists/:playlist_id/movies", playlists.addMovieToPlaylist);
  router.delete(
    "/playlists/:playlist_id/movies/:tmdb_id",
    playlists.removeMovieFromPlaylist
  );
  router.get("/playlists/:playlist_id/movies", playlists.getPlaylistMovies);

  // Watch Status routes
  router.post("/watch-status", watch.setWatchStatus);
  router.get("/watch-status", watch.getUserWatchStatus);

  // Recently Visited routes
  router.post("/recently-visited", visit.logVisit);
  router.get("/recently-visited", visit.getRecentVisits);

  // Test route
  router.get("/test", user.testRoute);

  return router;
};

export default createUserRouter;
