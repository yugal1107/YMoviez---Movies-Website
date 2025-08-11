import React from "react";
import { Link } from "react-router-dom";
import Moviecard from "../components/Moviecard";
import LoadingSpinner from "../components/LoadingSpinner";
import useWatchStatus from "../hooks/use-watch-status"; // Assuming this hook will be created

const WatchedPage = () => {
  const { watchStatus, loading, error } = useWatchStatus();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8 text-center">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );

  const watchedMovies = watchStatus.filter(
    (movie) => movie.status === "watched"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Movies You've</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Watched
            </span>
          </h1>
          <p className="text-gray-400">
            {watchedMovies.length > 0
              ? `You have watched ${watchedMovies.length} movie${
                  watchedMovies.length > 1 ? "s" : ""
                }`
              : "You haven't marked any movies as watched yet."}
          </p>
        </div>
        {watchedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
            {watchedMovies.map((movie) => (
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
                d="M2.036 12.322a1.012 1.012 0 010-.639l4.418-7.465a1.012 1.012 0 011.616 0l4.418 7.465a1.012 1.012 0 010 .639l-4.418 7.465a1.012 1.012 0 01-1.616 0l-4.418-7.465z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Watched Movies
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Use the eye icon on a movie's page to mark it as watched.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchedPage;
