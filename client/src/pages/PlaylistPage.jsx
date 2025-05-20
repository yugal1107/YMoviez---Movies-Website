import React from "react";
import usePlaylists from "../hooks/usePlaylists";
import Movietype from "../components/Movietype";
import { Loader2, Film, Trash2 } from "lucide-react";
import usePlaylistMovies from "../hooks/usePlaylistMovies";

const PlaylistPage = () => {
  const {
    playlists,
    isLoading: playlistsLoading,
    deletePlaylist,
  } = usePlaylists();

  if (playlistsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Your Playlists</span>
          </h1>
          <p className="text-gray-400">
            {playlists.length > 0
              ? `You have ${playlists.length} playlist${
                  playlists.length > 1 ? "s" : ""
                }`
              : "You don't have any playlists yet. Create one to get started!"}
          </p>
        </div>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl">
            <Film className="h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Playlists Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Create your first playlist by clicking the "Add to Playlist"
              button on any movie.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {playlists.map((playlist) => (
              <PlaylistSection
                key={playlist.playlist_id}
                playlist={playlist}
                onDelete={() => deletePlaylist(playlist.playlist_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlaylistSection = ({ playlist, onDelete }) => {
  const { movies, isLoading } = usePlaylistMovies(playlist.playlist_id);

  // Create a custom action component for the delete button
  const DeleteButton = (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        onDelete();
      }}
      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors ml-2"
      aria-label={`Delete playlist ${playlist.name}`}
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      ) : movies.length === 0 ? (
        <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-pink-500" />
              <h2 className="text-2xl font-bold">{playlist.name}</h2>
            </div>
            {DeleteButton}
          </div>
          <p className="text-gray-400">No movies in this playlist.</p>
        </div>
      ) : (
        <Movietype
          data={movies}
          title={playlist.name}
          icon={<Film className="h-6 w-6 text-pink-500" />}
          viewAllLink={`/playlist/${playlist.playlist_id}`}
          scrollId={`playlist-${playlist.playlist_id}`}
          actionElement={DeleteButton}
        />
      )}
    </div>
  );
};

export default PlaylistPage;
