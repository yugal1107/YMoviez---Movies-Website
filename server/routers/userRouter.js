import { Router } from "express";
import axios from "axios";
import {
  checkUser,
  createUser,
  login,
  logout,
} from "../controllers/authControllers.js";

const userRouter = Router();

userRouter.get("/login", (req, res) => {
  if (req.query.registration === "success") {
    return res.render("login", {
      message: "Registration was successfull. Now login to continue",
    });
  }
  res.render("login", { message: "" });
});

userRouter.get("/register", (req, res) => {
  res.render("register");
});

userRouter.post("/checkuser", checkUser);

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
