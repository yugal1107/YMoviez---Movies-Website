import express from "express";
import userRouter from "./routers/user.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import checkAuth from "./middlewares/auth-middlewares.js";
import movieRouter from "./routers/movieRouter.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/movie", checkAuth)

app.use("/api/movie", movieRouter);
app.use("/api/user", userRouter);

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

