import React, { memo } from "react";
import { Star, Calendar, Clock } from "lucide-react";

const MovieInfo = ({ movie }) => {
  return (
    <div className="flex-1 space-y-2 md:space-y-4 self-end">
      <h1 className="text-heading">{movie.title}</h1>
      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-caption md:text-body">
        <div className="flex items-center text-yellow-400">
          <Star className="h-5 w-5 mr-1 fill-yellow-400" />
          <span>{movie.vote_average?.toFixed(1)}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{movie.release_date}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Clock className="h-4 w-4 mr-1" />
          <span>{movie.runtime} min</span>
        </div>
      </div>
      <p className="text-caption md:text-body text-gray-300 max-w-3xl line-clamp-3 md:line-clamp-4">
        {movie.overview}
      </p>
    </div>
  );
};

export default memo(MovieInfo);
