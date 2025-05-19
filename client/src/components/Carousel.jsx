import React, { useState, memo } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import useLikedMovies from "../hooks/use-liked-movies";

const baseImgURL = "https://image.tmdb.org/t/p/original";

const MovieCarousel = memo(({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { likedMovies } = useLikedMovies();

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const isLiked = likedMovies?.some((liked) => liked.id === currentMovie.id);

  return (
    <div className="relative h-[50vh] md:h-[70vh] overflow-hidden mb-8">
      <div className="absolute inset-0">
        <img
          src={`${baseImgURL}${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-lg md:ml-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {currentMovie.title || currentMovie.name}
            </h2>
            <div className="flex items-center mb-4 space-x-3">
              <span className="bg-pink-600 text-white text-sm px-2 py-1 rounded-md flex items-center">
                <span className="mr-1">
                  {currentMovie.vote_average.toFixed(1)}
                </span>
                <span className="text-yellow-300">★</span>
              </span>
              <LikeButton
                id={currentMovie.id}
                initialLikeState={isLiked}
                className="mt-0"
              />
            </div>
            <p className="text-gray-300 text-sm md:text-lg mb-6 line-clamp-3">
              {currentMovie.overview}
            </p>
            <Link
              to={`/movie/${currentMovie.id}`}
              className="inline-flex items-center px-4 md:px-6 p-2 md:py-3 rounded-full bg-green-500 text-white text-sm md:text-base hover:bg-green-600 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" />
              View Details
            </Link>
          </div>
        </div>
      </div>
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1 md:p-2 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1 md:p-2 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
});

export default MovieCarousel;
