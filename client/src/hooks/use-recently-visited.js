import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchData } from "../utils/fetchData";
import { useAuth } from "../context/authContext";

const fetchRecentlyVisited = async (user) => {
  if (!user) return [];
  const data = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/user/recently-visited`
  );
  return data;
};

const logVisitAPI = async (tmdb_id) => {
  return await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/user/recently-visited`,
    {
      method: "POST",
      body: JSON.stringify({ tmdb_id }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
