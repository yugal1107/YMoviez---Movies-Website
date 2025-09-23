import express from "express";
import ratingsController from "../controllers/ratingsController.js";
import authenticateToken from "../middlewares/auth.js";

const createRatingsRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const ratings = ratingsController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  router.post("/", ratings.addOrUpdateRating);
  router.get("/user/:tmdb_id", ratings.getUserRating);
  router.get("/movie/:tmdb_id", ratings.getMovieRatings);

  return router;
};

export default createRatingsRouter;
