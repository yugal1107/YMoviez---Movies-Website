import express from "express";
import userController from "../controllers/userController.js";
import authenticateToken from "../middlewares/auth.js";

const createTestUserRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const user = userController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  // Test route
  router.get("/test", user.testRoute);

  return router;
};

export default createTestUserRouter;
