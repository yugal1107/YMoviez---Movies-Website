import React from "react";
import { useParams } from "react-router-dom";
import usePlaylistMovies from "../hooks/usePlaylistMovies";
import Movietype from "../components/Movietype";
import { Loader2, Film } from "lucide-react";
import useLikedMovies from "../hooks/use-liked-movies";
import usePlaylists from "../hooks/usePlaylists";

const PlaylistDetailPage = () => {
  const { playlistid } = useParams();
  const { movies, isLoading: moviesLoading } = usePlaylistMovies(playlistid);
  const { playlists, isLoading: playlistsLoading } = usePlaylists();
  const { likedMovies } = useLikedMovies();

  const playlist = playlists?.find(
    (p) =>
      p.playlist_id === parseInt(playlistid) || p.playlist_id === playlistid
  );
  const playlistName = playlist?.name || "Playlist";

  const isLoading = moviesLoading || playlistsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-in slide-in-from-bottom-4 duration-500">
            <span className="text-gray-100">{playlistName}</span>
          </h1>
          <p className="text-gray-400 animate-in slide-in-from-bottom-3 duration-500 delay-150">
            {movies.length > 0
              ? `Found ${movies.length} movies in this playlist`
              : "No movies in this playlist."}
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl animate-in slide-in-from-bottom-5 duration-500 delay-300">
            <Film className="h-16 w-16 text-gray-500 mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Empty Playlist
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              This playlist doesn't have any movies yet. Add some movies to see
              them here!
            </p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-5 duration-500 delay-300">
            <Movietype
              data={movies}
              title="" // Remove title as we have it in the page header
              scrollId={`playlist-${playlistid}`}
              likedMovies={likedMovies}
              useGrid={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
