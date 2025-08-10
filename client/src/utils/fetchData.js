import apiClient from "./apiClient"; // Import the configured Axios instance

async function fetchData(url, options = {}) {
  try {
    const response = await apiClient({
      url, // If apiClient has a baseURL, this should be the relative path
      method: options.method || "GET",
      headers: {
        // Default Content-Type is handled by apiClient instance.
        // Authorization header is handled by the interceptor if a user is logged in.
        ...options.headers, // Allows overriding any headers if needed for specific calls
      },
      data: options.body, // Axios uses 'data' for the request body
      // timeout is already set in apiClient, but can be overridden in options if needed
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error occurred while fetching data:",
      error.message,
      error.response ? error.response.data : "No response data",
      error.code
    );
    throw error;
  }
}

export { fetchData };
