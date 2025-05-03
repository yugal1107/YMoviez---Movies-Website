import express from "express";
import axios from "axios";

const router = express.Router();

// TMDB proxy route
router.get("/*", async (req, res) => {
  const tmdbPath = req.url.replace("/", "");
  const tmdbUrl = `https://api.themoviedb.org/3/${tmdbPath}`;

  try {
    const response = await axios.get(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from TMDB:", error.message);
    res.status(500).json({ error: "Failed to fetch data from TMDB" });
  }
});

export default router;