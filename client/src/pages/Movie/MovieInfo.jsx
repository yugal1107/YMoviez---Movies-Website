import React, { memo } from "react";
import { Star, Calendar, Clock } from "lucide-react";

const MovieInfo = ({ movie }) => {
  return (
    <div className="flex-1 space-y-4 self-end">
      <h1 className="text-5xl font-bold">{movie.title}</h1>
      <div className="flex items-center gap-6 text-lg">
        <div className="flex items-center text-yellow-400">
          <Star className="h-6 w-6 mr-1 fill-yellow-400" />
          <span>{movie.vote_average?.toFixed(1)}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Calendar className="h-5 w-5 mr-1" />
          <span>{movie.release_date}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Clock className="h-5 w-5 mr-1" />
          <span>{movie.runtime} min</span>
        </div>
      </div>
      <p className="text-xl text-gray-300 max-w-3xl">{movie.overview}</p>
    </div>
  );
};

export default memo(MovieInfo);