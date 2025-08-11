import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
      queryClient.invalidateQueries(["recentlyVisited", user?.uid]);
    },
  });

  const logVisit = (tmdb_id) => {
    // Prevent logging if already in the list to avoid spamming
    if (recentlyVisited.some((movie) => movie.tmdb_id === tmdb_id)) {
      return;
    }
    mutation.mutate(tmdb_id);
  };

  return { recentlyVisited, isLoading, error, logVisit };
};

export default useRecentlyVisited;
