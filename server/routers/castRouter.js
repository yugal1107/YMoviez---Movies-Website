import { Router } from "express";
import {
  searchCastDetails,
  searchMovieSeries,
} from "../controllers/castControllers.js";
const castRouter = Router();

castRouter.get("/movie/:castid", searchMovieSeries);
// castRouter.get("/cast/series/:castid", getSeriesByCast);
castRouter.get("/:castid", searchCastDetails);

export default castRouter;
