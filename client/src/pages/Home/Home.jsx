import { React, useRef } from "react";
import Movietype from "../../components/Movietype/index.jsx";
import { useAuth } from "../../context/authContext.jsx";
import { Loader2, Film, Popcorn, Star, Heart } from "lucide-react";
import MovieCarousel from "../../components/Carousel.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useQuery } from "@tanstack/react-query";
import useLikedMovies from "../../hooks/use-liked-movies.js";

const fetchMovies = async (endpoint) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API_URL}api/tmdb/${endpoint}`
  );
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

const Home = () => {
  const nowPlayingRef = useRef(null);
  const topRatedRef = useRef(null);
  const popularRef = useRef(null);
  const likedRef = useRef(null);

  const handleScroll = (ref, direction) => {
    if (!ref.current) return;
    const container = ref.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const { user } = useAuth();
  const {
    likedMovies,
    loading: likedLoading,
    error: likedError,
  } = useLikedMovies();

  const {
    data: nowPlaying,
    isLoading: nowPlayingLoading,
    error: nowPlayingError,
  } = useQuery({
    queryKey: ["now_playing"],
    queryFn: () => fetchMovies("movie/now_playing"),
  });

  const {
    data: topRated,
    isLoading: topRatedLoading,
    error: topRatedError,
  } = useQuery({
    queryKey: ["top_rated"],
    queryFn: () => fetchMovies("movie/top_rated"),
  });

  const {
    data: popular,
    isLoading: popularLoading,
    error: popularError,
  } = useQuery({
    queryKey: ["popular"],
    queryFn: () => fetchMovies("movie/popular"),
  });

  const isLoading =
    nowPlayingLoading || topRatedLoading || popularLoading || likedLoading;
  const error = nowPlayingError || topRatedError || popularError || likedError;

  if (isLoading) return <LoadingSpinner />;
  if (error && !nowPlaying && !topRated && !popular) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{error.message}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div>
        {popular && <MovieCarousel movies={popular.results.slice(0, 5)} />}
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {likedMovies?.length > 0 && (
              <Movietype
                data={{ results: likedMovies }}
                title="Liked Movies"
                icon={<Heart className="h-6 w-6 text-pink-500" />}
                scrollRef={likedRef}
                onScrollLeft={() => handleScroll(likedRef, "left")}
                onScrollRight={() => handleScroll(likedRef, "right")}
                likedMovies={likedMovies}
              />
            )}
            {nowPlaying && (
              <Movietype
                data={nowPlaying}
                title="Now Playing"
                type="now_playing"
                icon={<Film className="h-6 w-6" />}
                scrollRef={nowPlayingRef}
                onScrollLeft={() => handleScroll(nowPlayingRef, "left")}
                onScrollRight={() => handleScroll(nowPlayingRef, "right")}
                likedMovies={likedMovies}
              />
            )}
            {topRated && (
              <Movietype
                data={topRated}
                title="Top Rated"
                type="top_rated"
                icon={<Star className="h-6 w-6" />}
                scrollRef={topRatedRef}
                onScrollLeft={() => handleScroll(topRatedRef, "left")}
                onScrollRight={() => handleScroll(topRatedRef, "right")}
                likedMovies={likedMovies}
              />
            )}
            {popular && (
              <Movietype
                data={popular}
                title="Popular Movies"
                type="popular"
                icon={<Popcorn className="h-6 w-6" />}
                scrollRef={popularRef}
                onScrollLeft={() => handleScroll(popularRef, "left")}
                onScrollRight={() => handleScroll(popularRef, "right")}
                likedMovies={likedMovies}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
