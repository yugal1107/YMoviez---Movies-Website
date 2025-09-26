import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchData } from "../utils/fetchData";
import { useAuth } from "../context/authContext";

const fetchRecentlyVisited = async (user) => {
  if (!user) return [];
  const response = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/visits`
  );
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || "Failed to fetch recently visited");
};

const logVisitAPI = async (tmdb_id) => {
  const response = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/visits`,
    {
      method: "POST",
      body: JSON.stringify({ tmdb_id }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || "Failed to log visit");
};

const useRecentlyVisited = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: recentlyVisited = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentlyVisited", user?.uid],
    queryFn: () => fetchRecentlyVisited(user),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: logVisitAPI,
    onSuccess: () => {
      // Invalidate to refetch the list after a visit is logged.
      queryClient.invalidateQueries({
        queryKey: ["recentlyVisited", user?.uid],
      });
    },
  });

  // Use useCallback to memoize the logVisit function, making it stable.
  // The backend now handles duplicate visits, so the client-side check is removed.
  const logVisit = useCallback(
    (tmdb_id) => {
      if (tmdb_id) {
        mutation.mutate(tmdb_id);
      }
    },
    [mutation] // The mutation object from useMutation is stable.
  );

  return { recentlyVisited, isLoading, error, logVisit };
};

export default useRecentlyVisited;
