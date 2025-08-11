import React from "react";
import { Link } from "react-router-dom";
import Moviecard from "../components/Moviecard";
import LoadingSpinner from "../components/LoadingSpinner";
import useWatchStatus from "../hooks/use-watch-status"; // Assuming this hook will be created

const WatchlistPage = () => {
  const { watchStatus, loading, error } = useWatchStatus();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8 text-center">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );

  const watchlistMovies = watchStatus.filter(
    (movie) => movie.status === "want_to_watch"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Your</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Watchlist
            </span>
          </h1>
          <p className="text-gray-400">
            {watchlistMovies.length > 0
              ? `You have ${watchlistMovies.length} movie${
                  watchlistMovies.length > 1 ? "s" : ""
                } in your watchlist`
              : "Your watchlist is empty."}
          </p>
        </div>
        {watchlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
            {watchlistMovies.map((movie) => (
              <Link
                key={movie.tmdb_id}
                to={`/movie/${movie.tmdb_id}`}
                className="w-full flex justify-center"
              >
                <div className="w-36 sm:w-full max-w-[160px]">
                  <Moviecard
                    name={movie.title}
                    rating={movie.vote_average}
                    image_url={movie.poster_path}
                    id={movie.tmdb_id}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl">
            <svg
              className="h-16 w-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c.394.048.78.112 1.158.196m-1.158-.196a2.25 2.25 0 01-2.25-2.25c0-1.03.82-1.875 1.875-1.875h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-.375a1.875 1.875 0 01-1.875-1.875zM19.5 12.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h15c.621 0 1.125.504 1.125 1.125v1.5z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Your Watchlist is Empty
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Use the bookmark icon on a movie's page to add it to your
              watchlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
