import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const access_token_auth = process.env.ACCESS_TOKEN_AUTH;

async function getMovieSeries(credit_id) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${credit_id}/movie_credits`,
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while fetching data of cast from castcontroller", error);
  }
}

async function getCastDetails(credit_id) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${credit_id}`,
      {
        timeout: 1000,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token_auth}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while fetching data of cast from API", error);
  }
}

async function searchMovieSeries(req, res) {
  try {
    const movieData = await getMovieSeries(req.params.castid);
    res.status(200).send(movieData);
  } catch (error) {
    console.log("Error while fetching series movies data from API");
  }
}

async function searchCastDetails(req, res) {
  try {
    const castData = await getCastDetails(req.params.castid);
    res.status(200).send(castData);
  } catch (error) {
    console.log("Error while fetching cast details data from API");
  }
}

export { searchMovieSeries, searchCastDetails };