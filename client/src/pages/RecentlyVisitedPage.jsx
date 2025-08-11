import React from "react";
import { Link } from "react-router-dom";
import Moviecard from "../components/Moviecard";
import LoadingSpinner from "../components/LoadingSpinner";
import useRecentlyVisited from "../hooks/use-recently-visited";

const RecentlyVisitedPage = () => {
  const { recentlyVisited, isLoading, error } = useRecentlyVisited();

  if (isLoading) return <LoadingSpinner />;
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
            <span className="text-gray-100">Recently</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
              Viewed
            </span>
          </h1>
          <p className="text-gray-400">
            {recentlyVisited.length > 0
              ? `You have recently viewed ${recentlyVisited.length} movie${
                  recentlyVisited.length > 1 ? "s" : ""
                }`
              : "You haven't viewed any movies recently."}
          </p>
        </div>
        {recentlyVisited.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
            {recentlyVisited.map((movie) => (
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
                d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Recently Viewed Movies
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Start exploring movies and they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyVisitedPage;
