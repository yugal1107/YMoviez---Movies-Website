import React from "react";
import { Link } from "react-router-dom";
import Moviecard from "../../components/Moviecard";
import { Sparkles, Film } from "lucide-react";
import useLikedMovies from "../../hooks/use-liked-movies";

const RecommendedMovies = ({
  movies,
  title = "Recommended For You",
  subtitle = "Movies you might enjoy",
  isPoweredByML = false,
}) => {
  const { likedMovies } = useLikedMovies();

  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          {isPoweredByML ? (
            <Sparkles className="h-6 w-6 text-pink-500" />
          ) : (
            <Film className="h-6 w-6 text-pink-500" />
          )}
        </div>
        <p className="text-gray-400">{subtitle}</p>
        {isPoweredByML && (
          <p className="text-xs text-pink-500/70 mt-1">
            Powered by machine learning
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.slice(0, 12).map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="transform hover:scale-105 transition duration-300"
          >
            <Moviecard
              name={movie.title || movie.name}
              rating={movie.vote_average}
              image_url={movie.poster_path}
              id={movie.id}
              likedMovies={likedMovies}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedMovies;