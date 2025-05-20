import React from "react";
import { Link } from "react-router-dom";
import usePlaylists from "../hooks/usePlaylists";
import usePlaylistMovies from "../hooks/usePlaylistMovies";
import { Loader2, Film, X } from "lucide-react";
import Moviecard from "../components/Moviecard";

const PlaylistPage = () => {
  const { playlists, isLoading: playlistsLoading } = usePlaylists();

  if (playlistsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Your Playlists</h1>
        {playlists.length === 0 ? (
          <div className="bg-gray-900/50 rounded-lg p-6 text-center">
            <p className="text-gray-400">No playlists found. Create one!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {playlists.map((playlist) => (
              <PlaylistSection key={playlist.playlist_id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlaylistSection = ({ playlist }) => {
  const { movies, isLoading, removeMovie } = usePlaylistMovies(
    playlist.playlist_id
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Film className="h-6 w-6 text-pink-500" />
        <h2 className="text-2xl font-bold">{playlist.name}</h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      ) : movies.length === 0 ? (
        <div className="bg-gray-900/50 rounded-lg p-6">
          <p className="text-gray-400">No movies in this playlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <div key={movie.tmdb_id} className="relative group">
              <Link
                to={`/movie/${movie.tmdb_id}`}
                className="transform hover:scale-105 transition duration-300"
              >
                <Moviecard
                  name={movie.title}
                  rating={movie.vote_average}
                  image_url={movie.poster_path}
                  id={movie.tmdb_id}
                />
              </Link>
              <button
                onClick={() => removeMovie(movie.tmdb_id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from playlist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PlaylistPage;
