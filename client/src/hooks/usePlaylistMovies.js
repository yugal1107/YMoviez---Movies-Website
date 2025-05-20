import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import {
  getPlaylistMovies,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
} from "../utils/playlistUtils";
import { fetchData } from "../utils/fetchData";

export default function usePlaylistMovies(playlistId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: movies = [], isLoading, error } = useQuery({
    queryKey: ["playlistMovies", playlistId, user?.uid],
    queryFn: () =>
      getPlaylistMovies(
        playlistId,
        user,
        fetchData,
        import.meta.env.VITE_BASE_API_URL
      ),
    enabled: !!user && !!playlistId,
  });

  const addMovieMutation = useMutation({
    mutationFn: (tmdbId) =>
      addMovieToPlaylist(
        playlistId,
        tmdbId,
        user,
        fetchData,
        import.meta.env.VITE_BASE_API_URL
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["playlistMovies", playlistId, user?.uid]);
    },
  });

  const removeMovieMutation = useMutation({
    mutationFn: (tmdbId) =>
      removeMovieFromPlaylist(
        playlistId,
        tmdbId,
        user,
        fetchData,
        import.meta.env.VITE_BASE_API_URL
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["playlistMovies", playlistId, user?.uid]);
    },
  });

  return {
    movies,
    isLoading,
    error,
    addMovie: addMovieMutation.mutateAsync,
    removeMovie: removeMovieMutation.mutateAsync,
  };
}