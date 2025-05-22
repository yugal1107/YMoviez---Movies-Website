import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import { createPlaylist, deletePlaylist, getPlaylists } from "../utils/playlistUtils";
import { fetchData } from "../utils/fetchData";

export default function usePlaylists() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading, error } = useQuery({
    queryKey: ["playlists", user?.uid],
    queryFn: () =>
      getPlaylists(user, fetchData, import.meta.env.VITE_BASE_API_URL),
    enabled: !!user,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (name) =>
      createPlaylist(name, user, fetchData, import.meta.env.VITE_BASE_API_URL),
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists", user?.uid]);
    },
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: (playlistId) =>
      deletePlaylist(playlistId, user, fetchData, import.meta.env.VITE_BASE_API_URL),
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists", user?.uid]);
    },
  });

  return {
    playlists,
    isLoading,
    error,
    createPlaylist: createPlaylistMutation.mutateAsync,
    deletePlaylist: deletePlaylistMutation.mutateAsync,
  };
}