import axios from "axios";

async function fetchData(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000, // Set a 10-second timeout
    });
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching data:", error.message, error.code);
    throw error; // Rethrow to allow calling code to handle the error
  }
}

export { fetchData };