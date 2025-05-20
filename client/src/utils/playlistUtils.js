import { toast } from "react-hot-toast";

export const createPlaylist = async (name, user, fetchData, baseApiUrl) => {
  if (!user) {
    toast.error("Please login to create playlists");
    return { success: false, error: "User not logged in" };
  }

  try {
    const response = await fetchData(`${baseApiUrl}api/user/playlists`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (response?.playlist_id) {
      toast.success("Playlist created!");
      return { success: true, playlist: response };
    }
    throw new Error("Unexpected response");
  } catch (error) {
    toast.error("Failed to create playlist");
    return { success: false, error: error.message };
  }
};

export const getPlaylists = async (user, fetchData, baseApiUrl) => {
  if (!user) return [];

  try {
    const response = await fetchData(`${baseApiUrl}api/user/playlists`, {
      method: "GET",
    });
    return response || [];
  } catch (error) {
    toast.error("Failed to fetch playlists");
    return [];
  }
};

export const addMovieToPlaylist = async (
  playlistId,
  tmdbId,
  user,
  fetchData,
  baseApiUrl
) => {
  if (!user) {
    toast.error("Please login to add movies to playlists");
    return { success: false, error: "User not logged in" };
  }

  try {
    const response = await fetchData(
      `${baseApiUrl}api/user/playlists/${playlistId}/movies`,
      {
        method: "POST",
        body: JSON.stringify({ tmdb_id: tmdbId }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response?.message === "Movie added to playlist") {
      toast.success("Movie added to playlist!");
      return { success: true };
    }
    throw new Error("Unexpected response");
  } catch (error) {
    if (error.response?.status === 409) {
      toast("Movie already in playlist", { icon: "ℹ️" });
      return { success: true, alreadyInPlaylist: true };
    }
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else {
      toast.error("Failed to add movie to playlist");
    }
    return { success: false, error: error.message };
  }
};

export const removeMovieFromPlaylist = async (
  playlistId,
  tmdbId,
  user,
  fetchData,
  baseApiUrl
) => {
  if (!user) {
    toast.error("Please login to remove movies from playlists");
    return { success: false, error: "User not logged in" };
  }

  try {
    const response = await fetchData(
      `${baseApiUrl}api/user/playlists/${playlistId}/movies/${tmdbId}`,
      {
        method: "DELETE",
      }
    );

    if (response?.message === "Movie removed from playlist") {
      toast.success("Movie removed from playlist!");
      return { success: true };
    }
    throw new Error("Unexpected response");
  } catch (error) {
    if (error.response?.status === 404) {
      toast("Movie not in playlist", { icon: "ℹ️" });
      return { success: false, error: "Movie not found" };
    }
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else {
      toast.error("Failed to remove movie from playlist");
    }
    return { success: false, error: error.message };
  }
};

export const getPlaylistMovies = async (
  playlistId,
  user,
  fetchData,
  baseApiUrl
) => {
  if (!user) return [];

  try {
    const response = await fetchData(
      `${baseApiUrl}api/user/playlists/${playlistId}/movies`,
      {
        method: "GET",
      }
    );
    return response || [];
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else {
      toast.error("Failed to fetch playlist movies");
    }
    return [];
  }
};
