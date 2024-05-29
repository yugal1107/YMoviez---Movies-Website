import { Router } from "express";
import { movieHome } from "../controllers/movieControllers.js";

const homeRouter = Router();

homeRouter.get("/", movieHome)

export {homeRouter};