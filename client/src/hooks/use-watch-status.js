import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchData";
import { useAuth } from "../context/authContext";

const fetchWatchStatus = async (user) => {
  if (!user) return [];
  const data = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/user/watch-status`
  );
  return data;
};

const setWatchStatusAPI = async ({ tmdb_id, status }) => {
  return await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/user/watch-status`,
    {
      method: "POST",
      body: JSON.stringify({ tmdb_id, status }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
    onSuccess: () => {
      queryClient.invalidateQueries(["watchStatus", user?.uid]);
    },
  });

  const setWatchStatus = (tmdb_id, status) => {
    mutation.mutate({ tmdb_id, status });
  };

  return { watchStatus, isLoading, error, setWatchStatus };
};

export default useWatchStatus;
