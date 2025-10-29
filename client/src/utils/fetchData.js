import apiClient from "./apiClient"; // Import the configured Axios instance

async function fetchData(url, options = {}) {
  try {
    const response = await apiClient({
      url,
      method: options.method || "GET",
      headers: {
        ...options.headers,
      },
      data: options.body,
      // Allow per-request timeout override
      timeout: options.timeout,
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
