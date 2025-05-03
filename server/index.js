import express from "express";
import dotenv from "dotenv";
import movieRouter from "./routers/movieRouter.js";
import navRouter from "./routers/navRouter.js";
import cookieParser from "cookie-parser";
import { homeRouter } from "./routers/homeRouter.js";
import seriesRouter from "./routers/seriesRouter.js";
import castRouter from "./routers/castRouter.js";
import genreRouter from "./routers/genreRouter.js";
import cors from "cors";
import chatRouter from "./routers/chatRouter.js";
import { Pool } from "pg";
import { initializeApp, cert } from "firebase-admin/app";
import tmdbRoutes from "./routes/tmdb.js";
import userRoutes from "./routes/user.js";


dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/home", homeRouter);
app.use("/api/movie", movieRouter);
app.use("/api/series", seriesRouter);
app.use("/api/navbar", navRouter);
app.use("/api/cast", castRouter);
app.use("/api/genres", genreRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user", userRoutes);

// TMDB Proxy Route
app.use("/api/tmdb", tmdbRoutes);

app.listen(PORT, () => {
  console.log("Server is running at port 3000");
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received. Closing server...");
  await pool.end();
  process.exit(0);
});