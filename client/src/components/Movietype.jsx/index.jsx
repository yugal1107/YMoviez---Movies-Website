import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import Moviecard from "../Moviecard";

const baseImgURL = "https://image.tmdb.org/t/p/w500";

const Movietype = ({ data, title, icon }) => {
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

      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto p-4 scrollbar-hide">
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
              />
            </Link>
          ))}
        </div>

        {/* Optional: Gradient fades for scroll indication */}
        <div className="pointer-events-none absolute inset-y-0 left-0 md:w-10 bg-gradient-to-r from-gray-400 dark:from-gray-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 md:w-10 bg-gradient-to-l from-gray-400 dark:from-gray-900" />
      </div>
    </div>
  );
};

export default Movietype;
