import { Router } from "express";
const castRouter = Router();

castRouter.get("/cast/movie/:castid", getMoviesByCast);
castRouter.get("/cast/series/:castid", getSeriesByCast);
castRouter.get("/cast/:castid", getCastDetails);

export default castRouter;