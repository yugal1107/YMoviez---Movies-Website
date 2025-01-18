import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const access_token_auth = process.env.ACCESS_TOKEN_AUTH;

// Get all genres
async function getGenres() {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`,
        },
      }
    );
    return response.data.genres;
  } catch (error) {
    console.log("Error while fetching genres from API", error);
    throw error;
  }
}

// Get movies by genre
async function getMoviesByGenre(genreId) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`,
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.log("Error while fetching movies by genre from API", error);
    throw error;
  }
}

// Controller to handle genres and movies by genre requests
async function movieGenres(req, res) {
  try {
    const genres = await getGenres();
    res.json({ genres: genres });
  } catch (error) {
    res.status(500).send({ msg: "Error while fetching genres from API" });
  }
}

async function moviesByGenre(req, res) {
  try {
    const genreId = req.params.genreId;
    const movies = await getMoviesByGenre(genreId);
    res.json({ movies: movies });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Error while fetching movies by genre from API" });
  }
}

export { movieGenres, moviesByGenre };
