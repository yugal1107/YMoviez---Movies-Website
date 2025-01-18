import Router from "express";
import { navName } from "../controllers/navControllers.js";

const navRouter = Router();

navRouter.get("/" , navName );

export default navRouter;
