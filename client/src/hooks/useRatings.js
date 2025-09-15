import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingsApi } from "../utils/ratingsApi";
import { toast } from "react-hot-toast";

export const useUserRating = (tmdb_id) => {
  return useQuery({
    queryKey: ["userRating", tmdb_id],
    queryFn: () => ratingsApi.getUserRating(tmdb_id),
    enabled: !!tmdb_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMovieRatings = (tmdb_id) => {
  return useQuery({
    queryKey: ["movieRatings", tmdb_id],
    queryFn: () => ratingsApi.getMovieRatings(tmdb_id),
    enabled: !!tmdb_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddOrUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tmdb_id, rating }) =>
      ratingsApi.addOrUpdateRating(tmdb_id, rating),
    onSuccess: (data, variables) => {
      toast.success("Rating saved successfully!");
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["userRating", variables.tmdb_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["movieRatings", variables.tmdb_id],
      });
    },
    onError: (error) => {
      toast.error("Failed to save rating. Please try again.");
      console.error("Error saving rating:", error);
    },
  });
};
