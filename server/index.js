import express from "express";
import userRouter from "./routers/userRouter.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import checkAuth from "./middlewares/auth-middlewares.js";
import movieRouter from "./routers/movieRouter.js";
import navRouter from "./routers/navRouter.js";
import cookieParser from "cookie-parser";
import { homeRouter } from "./routers/homeRouter.js";
import seriesRouter from "./routers/seriesRouter.js";
import castRouter from "./routers/castRouter.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/movie", checkAuth);
app.use("/api/navbar", checkAuth);

app.use("/api/home", homeRouter);
app.use("/api/movie", movieRouter);
app.use("/api/series", seriesRouter);
app.use("/api/user", userRouter);
app.use("/api/navbar", navRouter);
app.use("/api/cast", castRouter);

// app.use("/api/authenticate" , authicateUser )

//Connection with mongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error:", error.message);
  });

app.listen(PORT, () => {
  console.log("Server is running at port 3000");
});
