import { Router } from "express";
import {
  seriesCast,
  seriesDetails,
  seriesHome,
  seriesSearch,
} from "../controllers/seriesControllers.js";

const seriesRouter = Router();

seriesRouter.get("/home", seriesHome);

seriesRouter.get("/cast/:seriesid", seriesCast);

seriesRouter.get("/details/:seriesid", seriesDetails);

seriesRouter.get("/search/:keyword", seriesSearch);

export default seriesRouter;
