import axios from "axios";
import dotenv from "dotenv";
import popular from "../data/popular.json" assert { type: "json" };
import upcoming from "../data/upcoming.json" assert { type: "json" };
import trending from "../data/trending.json" assert { type: "json" };
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

dotenv.config();

const access_token_auth = process.env.ACCESS_TOKEN_AUTH;
// const page = 1;

// const responses = {
//   popular_movies: popular.results,
//   upcoming_movies: upcoming.results,
//   trending_movies: trending.results,
// };

async function getMovie() {
  try {
    const hindi_response = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&with_original_language=hi",
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`, // Correct template literal usage
        },
      }
    );
    const trending_response = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`, // Correct template literal usage
        },
      }
    );

    const trending_movies=trending_response.data;
    const hindi_movies=hindi_response.data;

    return {trending_movies:trending_movies , hindi_movies:hindi_movies };

    // return responses;
  } catch (error) {
    console.log("Error while fetching data from API", error);
    // Handle the error appropriately (e.g., throw error, return default value, etc.)
    throw error; // Optionally rethrow the error to handle it further up the call stack
  }
}

async function getCast(movieid) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieid}/credits?language=en-US`,
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`, // Correct template literal usage
        },
      }
    );
    const castData = response.data; // No need to await response.data

    return castData;
  } catch (error) {
    console.log("Error while fetching data from API", error);
    // Handle the error appropriately (e.g., throw error, return default value, etc.)
    throw error; // Optionally rethrow the error to handle it further up the call stack
  }
}

async function getDetails(movieid) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieid}`,
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`, // Correct template literal usage
        },
      }
    );
    const details = response.data; // No need to await response.data

    return details;
  } catch (error) {
    console.log("Error while fetching data from getDetails() API /n", error);
    // Handle the error appropriately (e.g., throw error, return default value, etc.)
    throw error; // Optionally rethrow the error to handle it further up the call stack
  }
}

async function getSearch(keyword) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`,
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`,
        },
      }
    );
    const searchData = response.data;
    return searchData;
  } catch (error) {
    console.log("Error while searching movie data from API", error);
    throw error;
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

async function movieCast(req, res) {
  try {
    const movieid = req.params.movieid;
    const castData = await getCast(movieid);
    res.json({ castData: castData });
  } catch (error) {
    console.log("Error while fetching data from castData API");
    res
      .status(500)
      .send({ msg: "Error while fetching data from castData API" });
  }
}

async function movieDetails(req, res) {
  try {
    const movieid = req.params.movieid;
    const details = await getDetails(movieid);
    res.json({ movieDetails: details });
  } catch (error) {
    console.log("Error while fetching mvieDetails data from details API");
    res
      .status(500)
      .send({ msg: "Error while fetching movieDetails data from details API" });
  }
}

async function movieSearch(req, res) {
  try {
    const keyword = req.params.keyword;
    const searchData = await getSearch(keyword);
    res.json({ searchData: searchData });
  } catch (error) {
    console.log("Error while fetching data from search API");
    res.status(500).send({ msg: "Error while fetching data from search API" });
  }
}

export { movieHome, getMovie, movieCast, movieDetails , movieSearch };
