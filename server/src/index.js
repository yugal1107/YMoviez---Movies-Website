import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Centralized imports
import pool from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { getOrCreateMovie } from "./services/movie.service.js";

// Route imports
import navRouter from "./routes/navRouter.js";
import chatRouter from "./routes/chatRouter.js";
import tmdbRoutes from "./routes/tmdb.js";
import createLikesRouter from "./routes/likes.routes.js";
import createPlaylistsRouter from "./routes/playlists.routes.js";
import createWatchRouter from "./routes/watch.routes.js";
import createVisitRouter from "./routes/visit.routes.js";
import createRatingsRouter from "./routes/ratings.routes.js";
import createCommentsRouter from "./routes/comments.routes.js";
import createTestUserRouter from "./routes/test.user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Core Middleware
app.use(cors()); // Consider more restrictive CORS settings for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Instantiate Routers
const likesRouter = createLikesRouter(pool, getOrCreateMovie);
const playlistsRouter = createPlaylistsRouter(pool, getOrCreateMovie);
const watchRouter = createWatchRouter(pool, getOrCreateMovie);
const visitRouter = createVisitRouter(pool, getOrCreateMovie);
const ratingsRouter = createRatingsRouter(pool, getOrCreateMovie);
const commentsRouter = createCommentsRouter(pool, getOrCreateMovie);
const testUserRouter = createTestUserRouter(pool, getOrCreateMovie);

// Mount Routers
app.use("/health", (req, res) => res.send("OK"));
app.use("/api/navbar", navRouter);
app.use("/api/chat", chatRouter);
app.use("/api/tmdb", tmdbRoutes);

// New modular user-data routes
app.use("/api/likes", likesRouter);
app.use("/api/playlists", playlistsRouter);
app.use("/api/watch", watchRouter);
app.use("/api/visits", visitRouter); // Renamed from 'visit' to 'visits' for consistency
app.use("/api/ratings", ratingsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/user", testUserRouter); // Contains the '/test' route

// Centralized Error Handler - MUST be last
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} signal received. Closing server...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    await pool.end();
    console.log("Database pool closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
