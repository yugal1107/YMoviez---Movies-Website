import express from "express";
import visitController from "../controllers/visitController.js";
import authenticateToken from "../middlewares/auth.js";

const createVisitRouter = (pool, getOrCreateMovie) => {
  const router = express.Router();
  const visit = visitController(pool, getOrCreateMovie);

  router.use(authenticateToken);

  router.post("/", visit.logVisit);
  router.get("/", visit.getRecentVisits);

  return router;
};

export default createVisitRouter;
