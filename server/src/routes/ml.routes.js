import express from "express";
import axios from "axios";

const router = express.Router();

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

// ML recommendation proxy route
router.get("/recommend", async (req, res) => {
  const { tmdb_id, top_n } = req.query;

  if (!tmdb_id) {
    return res.status(400).json({ error: "Missing required query param: tmdb_id" });
  }

  const mlUrl = `${ML_API_URL}/recommend?tmdb_id=${tmdb_id}&top_n=${top_n || 10}`;

  try {
    const response = await axios.get(mlUrl, {
      timeout: 30000, // 30-second timeout for ML container cold start
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from ML API:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations from ML API" });
  }
});

export default router;
