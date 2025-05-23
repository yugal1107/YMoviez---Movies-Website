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
import tmdbRoutes from "./routes/tmdb.js";
import createUserRouter from "./routes/user.js";
import pool from "./config/db.js";
import axios from "axios"; // Import axios

dotenv.config();
const app = express();
const PORT = 3000;

// Helper function to get or create a movie in the movies table
const getOrCreateMovie = async (tmdb_id) => {
  try {
    // Check if the movie already exists
    const movieQuery = `
      SELECT movie_id, title, poster_path, vote_average
      FROM movies
      WHERE tmdb_id = $1;
    `;
    const movieResult = await pool.query(movieQuery, [tmdb_id]);
    if (movieResult.rows.length > 0) {
      return movieResult.rows[0];
    }

    // Fetch movie details from TMDB API using axios
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}`;
    const response = await axios.get(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN_AUTH}`,
        "Content-Type": "application/json",
      },
      timeout: 5000, // 5-second timeout
    });

    const movieData = response.data;

    // Insert the movie into the movies table
    const insertQuery = `
      INSERT INTO movies (tmdb_id, title, poster_path, vote_average, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING movie_id, title, poster_path, vote_average;
    `;
    const insertValues = [
      tmdb_id,
      movieData.title,
      movieData.poster_path || null,
      movieData.vote_average || null,
    ];
    const insertResult = await pool.query(insertQuery, insertValues);
    return insertResult.rows[0];
  } catch (error) {
    console.error("Error in getOrCreateMovie:", error.message);
    throw error;
  }
};

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/home", homeRouter);
app.use("/api/movie", movieRouter);
app.use("/api/series", seriesRouter);
app.use("/api/navbar", navRouter);
app.use("/api/cast", castRouter);
app.use("/api/genres", genreRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user", createUserRouter(pool, getOrCreateMovie));
app.use("/api/tmdb", tmdbRoutes);

// Start the server
app.listen(PORT, () => {
  console.log("Server is running at port 3000");
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received. Closing server...");
  await pool.end();
  process.exit(0);
});