import axios from "axios";

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    console.log("Response : " , response);
    return response.data;
  } catch (error) {
    console.error("Error occured while fetching data : ", error);
  }
}

export { fetchData };
