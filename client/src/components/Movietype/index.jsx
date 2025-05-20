import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Moviecard from "../Moviecard";
import ScrollButton from "../ScrollButton";

const Movietype = ({
  data,
  title,
  icon,
  viewAllLink,
  scrollId,
  likedMovies,
  useGrid = false,
  actionElement, // New prop for action buttons like delete
}) => {
  const scrollRef = useRef(null);

  const onScrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  const onScrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  // Normalize data for playlists (array of movies) vs TMDB data (object with results)
  const movies = data.results || data;

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {actionElement && <span className="ml-2">{actionElement}</span>}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center space-x-1 text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
          >
            <span className="text-xs md:text-sm font-medium">View All</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {useGrid ? (
        // Grid layout for detail pages
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
          {movies.map((movie) => (
            <Link
              key={movie.id || movie.tmdb_id}
              to={`/movie/${movie.id || movie.tmdb_id}`}
              className="w-full flex justify-center"
            >
              <div className="w-36 sm:w-full max-w-[160px]">
                <Moviecard
                  name={movie.title || movie.name}
                  description={movie.overview}
                  rating={movie.vote_average}
                  image_url={movie.poster_path}
                  id={movie.id || movie.tmdb_id}
                  likedMovies={likedMovies}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Horizontal scroll layout for home page and regular lists
        <div className="relative group px-2 lg:px-10">
          <ScrollButton
            onClick={onScrollLeft}
            icon={<ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 rotate-180" />}
            direction="left"
          />
          <div
            ref={scrollRef}
            id={scrollId}
            className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth"
          >
            {movies.map((movie) => (
              <Link
                key={movie.id || movie.tmdb_id}
                to={`/movie/${movie.id || movie.tmdb_id}`}
                className="flex-none transform transition-transform hover:scale-105"
              >
                <Moviecard
                  name={movie.title || movie.name}
                  description={movie.overview}
                  rating={movie.vote_average}
                  image_url={movie.poster_path}
                  id={movie.id || movie.tmdb_id}
                  likedMovies={likedMovies}
                />
              </Link>
            ))}
          </div>
          <ScrollButton
            onClick={onScrollRight}
            icon={<ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />}
            direction="right"
          />
        </div>
      )}
    </div>
  );
};

export default Movietype;
