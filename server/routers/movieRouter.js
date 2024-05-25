import { Router } from "express";
import { movieHome } from "../controllers/movieControllers.js";

const movieRouter = Router();

movieRouter.get("/home", movieHome);


export default movieRouter;
