// routes/chatRoutes.js
import express from "express";
import chatController from "../controllers/chatController.js";

const chatRouter = express.Router();

// Chat route
chatRouter.post("/send", chatController.sendMessage);

export default chatRouter;
