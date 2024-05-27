import axios from "axios";
import dotenv from "dotenv";
import popular from "../data/popular.json" assert { type: "json" };
import upcoming from "../data/upcoming.json" assert { type: "json" };
import trending from "../data/trending.json" assert { type: "json" };

dotenv.config();

const access_token_auth = process.env.ACCESS_TOKEN_AUTH;
// const page = 1;

const responses = {
  popular_movies: popular.results,
  upcoming_movies: upcoming.results,
  trending_movies: trending.results,
};

async function getMovie() {
  try {
    // const response = await axios.get(
    //   "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&with_original_language=hi",
    //   {
    //     timeout: 1000,
    //     headers: {
    //       accept: "application/json",
    //       Authorization: `Bearer ${access_token_auth}`, // Correct template literal usage
    //     },
    //   }
    // );
    // const movieData = response.data; // No need to await response.data

    return responses;
  } catch (error) {
    console.log("Error while fetching data from API", error);
    // Handle the error appropriately (e.g., throw error, return default value, etc.)
    throw error; // Optionally rethrow the error to handle it further up the call stack
  }
}

async function movieHome(req, res) {
  try {
    const movieData = await getMovie();
    // console.log("movieData", movieData);
    res.json({ movieData: movieData, user: req.user });
  } catch (error) {
    console.log("Error while fetching data from API");
    res.status(500).send({ msg: "Error while fetching data from API" });
  }
}

export { movieHome, getMovie };
