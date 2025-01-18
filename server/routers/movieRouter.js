import { Router } from "express";
import {
  movieCast,
  movieDetails,
  movieHome,
  movieSearch,
} from "../controllers/movieControllers.js";

const movieRouter = Router();

movieRouter.get("/home", movieHome);

movieRouter.get("/cast/:movieid", movieCast);

movieRouter.get("/details/:movieid", movieDetails);

movieRouter.get("/search/:keyword", movieSearch);

export default movieRouter;
