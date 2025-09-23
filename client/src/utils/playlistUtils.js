import { toast } from "react-hot-toast";

export const createPlaylist = async (name, user, fetchData, baseApiUrl) => {
  if (!user) {
    toast.error("Please login to create playlists");
    return { success: false, error: "User not logged in" };
  }

  try {
    const response = await fetchData(`${baseApiUrl}api/playlists`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.success) {
      toast.success(response.message || "Playlist created!");
      return { success: true, playlist: response.data };
    }
    throw new Error(response.message || "Unexpected response");
  } catch (error) {
    toast.error(error.message || "Failed to create playlist");
    return { success: false, error: error.message };
  }
};

export const deletePlaylist = async (playlistId, user, fetchData, baseApiUrl) => {
  if (!user) {
    toast.error("Please login to delete playlists");
    return { success: false, error: "User not logged in" };
  }

  try {
    const response = await fetchData(`${baseApiUrl}api/playlists/${playlistId}`, {
      method: "DELETE",
    });

    if (response.success) {
      toast.success(response.message || "Playlist deleted!");
      return { success: true };
    }
    throw new Error(response.message || "Unexpected response");
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else if (error.response?.status === 404) {
      toast.error("Playlist not found");
    } else {
      toast.error(error.message || "Failed to delete playlist");
    }
    return { success: false, error: error.message };
  }
};

export const getPlaylists = async (user, fetchData, baseApiUrl) => {
  if (!user) return [];

  try {
    const response = await fetchData(`${baseApiUrl}api/playlists`, {
      method: "GET",
    });
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.message || "Failed to fetch playlists");
  } catch (error) {
    toast.error(error.message || "Failed to fetch playlists");
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
      `${baseApiUrl}api/playlists/${playlistId}/movies`,
      {
        method: "POST",
        body: JSON.stringify({ tmdb_id: tmdbId }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.success) {
      toast.success(response.message || "Movie added to playlist!");
      return { success: true };
    }
    throw new Error(response.message || "Unexpected response");
  } catch (error) {
    if (error.response?.status === 409) {
      toast("Movie already in playlist", { icon: "ℹ️" });
      return { success: true, alreadyInPlaylist: true };
    }
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else {
      toast.error(error.message || "Failed to add movie to playlist");
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
      `${baseApiUrl}api/playlists/${playlistId}/movies/${tmdbId}`,
      {
        method: "DELETE",
      }
    );

    if (response.success) {
      toast.success(response.message || "Movie removed from playlist!");
      return { success: true };
    }
    throw new Error(response.message || "Unexpected response");
  } catch (error) {
    if (error.response?.status === 404) {
      toast("Movie not in playlist", { icon: "ℹ️" });
      return { success: false, error: "Movie not found" };
    }
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else {
      toast.error(error.message || "Failed to remove movie from playlist");
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
      `${baseApiUrl}api/playlists/${playlistId}/movies`,
      {
        method: "GET",
      }
    );
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.message || "Failed to fetch playlist movies");
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error("You don’t own this playlist");
    } else {
      toast.error(error.message || "Failed to fetch playlist movies");
    }
    return [];
  }
};