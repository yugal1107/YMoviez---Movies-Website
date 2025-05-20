import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Moviecard from "../Moviecard";
import ScrollButton from "../ScrollButton";

const Movietype = ({
  data,
  title,
  icon,
  scrollRef,
  onScrollLeft,
  onScrollRight,
  likedMovies,
}) => {
  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <button className="flex items-center space-x-1 text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors">
          <span className="text-xs md:text-sm font-medium">View All</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="relative group px-2 lg:px-10">
        <ScrollButton
          onClick={onScrollLeft}
          icon={<ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 rotate-180" />}
          direction="left"
        />
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth"
        >
          {data.results.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="flex-none transform transition-transform hover:scale-105"
            >
              <Moviecard
                name={movie.title || movie.name}
                description={movie.overview}
                rating={movie.vote_average}
                image_url={movie.poster_path}
                id={movie.id}
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
    </div>
  );
};

export default Movietype;