// filepath: /home/yugal/WebD/movies-website-project/client/src/utils/apiClient.js
import axios from "axios";
import { getAuth } from "firebase/auth";
import { app as firebaseApp } from "../firebase"; // Adjust path if your firebase.js is elsewhere

const apiClient = axios.create({
  // You can set a baseURL here if all your API calls share a common prefix
  // baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000, // Default timeout for requests
  headers: {
    "Content-Type": "application/json", // Default Content-Type
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(); // Firebase SDK handles token refresh
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting ID token for request interceptor:", error);
        // You might want to handle this error, e.g., by rejecting the request
        // return Promise.reject(error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
