import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchData";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const fetchWatchStatus = async (user) => {
  if (!user) return [];
  const response = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/watch/status`
  );
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || "Failed to fetch watch status");
};

const setWatchStatusAPI = async ({ tmdb_id, status }) => {
  const response = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/watch/status`,
    {
      method: "POST",
      body: JSON.stringify({ tmdb_id, status }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || "Failed to set watch status");
};

const useWatchStatus = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: watchStatus = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["watchStatus", user?.uid],
    queryFn: () => fetchWatchStatus(user),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: setWatchStatusAPI,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["watchStatus", user?.uid] });
      const message =
        variables.status === "watched"
          ? "Movie marked as watched!"
          : "Added to your watchlist!";
      toast.success(message);
    },
    onError: (error) => {
      toast.error("Failed to update status.");
      console.error("Error setting watch status:", error);
    },
  });

  const setWatchStatus = (tmdb_id, status) => {
    mutation.mutate({ tmdb_id, status });
  };

  return {
    watchStatus,
    isLoading: mutation.isPending,
    error,
    setWatchStatus,
  };
};

export default useWatchStatus;
