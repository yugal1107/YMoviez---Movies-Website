import { Router } from "express";
import { navName } from "../controllers/navController.js";

const navRouter = Router();

navRouter.get("/" , navName );

export default navRouter;
