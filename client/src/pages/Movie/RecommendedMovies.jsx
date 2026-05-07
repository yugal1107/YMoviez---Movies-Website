import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, Film } from "lucide-react";
import Moviecard from "../../components/Moviecard";
import ScrollButton from "../../components/ScrollButton";
import useLikedMovies from "../../hooks/use-liked-movies";

const RecommendedMovies = ({
  movies,
  title = "Recommended For You",
  subtitle = "Movies you might enjoy",
  isPoweredByML = false,
}) => {
  const { likedMovies } = useLikedMovies();
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

  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-subheading">{title}</h2>
          {isPoweredByML ? (
            <Sparkles className="h-6 w-6 text-pink-500" />
          ) : (
            <Film className="h-6 w-6 text-pink-500" />
          )}
        </div>
        <p className="text-caption text-gray-400">{subtitle}</p>
        {isPoweredByML && (
          <p className="text-xs text-pink-500/70 mt-1">
            Powered by machine learning
          </p>
        )}
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
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="flex-none transform transition-transform hover:scale-105"
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
        <ScrollButton
          onClick={onScrollRight}
          icon={<ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />}
          direction="right"
        />
      </div>
    </section>
  );
};

export default RecommendedMovies;
