import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const access_token_auth = process.env.ACCESS_TOKEN_AUTH;
// const page = 1;

async function getSeries() {
  try {
    const response = await axios.get("url", {
      timeout: 1000,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token_auth}`, // Correct template literal usage
      },
    });
    const seriesData = response.data; // No need to await response.data

    return seriesData;
  } catch (error) {
    console.log("Error while fetching data from API", error);
    // Handle the error appropriately (e.g., throw error, return default value, etc.)
    throw error; // Optionally rethrow the error to handle it further up the call stack
  }
}

async function getCast(seriesid) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${seriesid}/credits`,
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

async function getDetails(seriesid) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${seriesid}`,
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
    console.log("Error while fetching data from API", error);
    // Handle the error appropriately (e.g., throw error, return default value, etc.)
    throw error; // Optionally rethrow the error to handle it further up the call stack
  }
}

async function getSearch(keyword) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/tv?query=${keyword}&include_adult=false&language=en-US&page=1`,
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
    console.log("Error while searching series data from API", error);
    throw error;
  }
}

async function seriesHome(req, res) {
  try {
    const seriesData = await getSeries();
    // console.log("seriesData", seriesData);
    res.json({ seriesData: seriesData, user: req.user });
  } catch (error) {
    console.log("Error while fetching data from API");
    res.status(500).send({ msg: "Error while fetching data from API" });
  }
}

async function seriesCast(req, res) {
  try {
    const seriesid = req.params.seriesid;
    const castData = await getCast(seriesid);
    res.json({ castData: castData });
  } catch (error) {
    console.log("Error while fetching data from castData API");
    res
      .status(500)
      .send({ msg: "Error while fetching data from castData API" });
  }
}

async function seriesDetails(req, res) {
  try {
    const seriesid = req.params.seriesid;
    const details = await getDetails(seriesid);
    res.json({ seriesDetails: details });
  } catch (error) {
    console.log("Error while fetching mvieDetails data from details API");
    res.status(500).send({
      msg: "Error while fetching seriesDetails data from details API",
    });
  }
}

async function seriesSearch(req, res) {
  try {
    const keyword = req.params.keyword;
    const searchData = await getSearch(keyword);
    res.json({ searchData: searchData });
  } catch (error) {
    console.log("Error while fetching data from search API");
    res.status(500).send({ msg: "Error while fetching data from search API" });
  }
}

export { seriesHome, getSeries, seriesCast, seriesDetails, seriesSearch };
