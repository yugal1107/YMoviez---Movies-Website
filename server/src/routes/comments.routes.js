import express from "express";
import commentsController from "../controllers/commentsController.js";
import authenticateToken from "../middlewares/auth.js";

const createCommentsRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const comments = commentsController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  router.post("/", comments.addComment);
  router.get("/:tmdb_id", comments.getComments);
  router.put("/:commentId", comments.updateComment);
  router.delete("/:commentId", comments.deleteComment);

  return router;
};

export default createCommentsRouter;
