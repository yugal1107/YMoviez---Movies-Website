import { Router } from "express";
import { movieGenres, moviesByGenre } from "../controllers/genreControllers.js";

const genreRouter = Router();

genreRouter.get("/getgenres", movieGenres);
genreRouter.get("/:genreId", moviesByGenre);

export default genreRouter;
