import React from "react";
import { Link } from "react-router-dom";
import Moviecard from "../components/Moviecard";
import LoadingSpinner from "../components/LoadingSpinner";
import useLikedMovies from "../hooks/use-liked-movies";

const LikedMoviesPage = () => {
  const { likedMovies, loading, error } = useLikedMovies();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8 text-center">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Your</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
              Liked Movies
            </span>
          </h1>
          <p className="text-gray-400">
            {likedMovies.length > 0
              ? `You have liked ${likedMovies.length} movie${
                  likedMovies.length > 1 ? "s" : ""
                }`
              : "No liked movies yet"}
          </p>
        </div>
        {likedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
            {likedMovies.map((movie) => (
              <Link
                key={movie.id || movie.movie_id || movie.tmdb_id}
                to={`/movie/${movie.id || movie.movie_id || movie.tmdb_id}`}
                className="w-full flex justify-center"
              >
                <div className="w-36 sm:w-full max-w-[160px]">
                  <Moviecard
                    name={movie.title || movie.name}
                    description={movie.overview}
                    rating={movie.vote_average}
                    image_url={movie.poster_path}
                    id={movie.id || movie.movie_id || movie.tmdb_id}
                    likedMovies={likedMovies}
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
                d="M16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 12 12 21 12 21C12 21 16.5 12 16.5 7.5Z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No liked movies found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't liked any movies yet. Start exploring and like your
              favorite movies to see them here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedMoviesPage;
