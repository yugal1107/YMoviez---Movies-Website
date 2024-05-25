import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const access_token_auth = process.env.ACCESS_TOKEN_AUTH;
// const page = 1;

const urls = [
  "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
];

async function getMovie() {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&&with_original_language=hi",
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`,
        },
      }
    );
    const movieData = response.data;
    console.log("Console from getMovie");
    return movieData;
  } catch (error) {
    console.log("Error while fetching data from API", error);
    // res.status(500).send({ msg: "Error while fetching data from API" , error });
  }
}

async function movieHome(req, res) {
  try {
    const movieData = await getMovie();
    console.log("movieData", movieData);
    res.send(movieData);
  } catch (error) {
    console.log("Error while fetching data from API");
    res.status(500).send({ msg: "Error while fetching data from API" });
  }
}

export { movieHome };
