import express from "express";
import likesController from "../controllers/likesController.js";
import authenticateToken from "../middlewares/auth.js";

const createLikesRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const likes = likesController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  router.post("/", likes.addLike);
  router.delete("/:tmdb_id", likes.removeLike);
  router.get("/", likes.getUserLikes);

  return router;
};

export default createLikesRouter;
