import express from "express";
import watchController from "../controllers/watchController.js";
import authenticateToken from "../middlewares/auth.js";

const createWatchRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const watch = watchController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  router.post("/status", watch.setWatchStatus);
  router.get("/status", watch.getUserWatchStatus);

  return router;
};

export default createWatchRouter;
