import { React, useRef } from "react";
import Movietype from "../../components/Movietype/index.jsx";
import { useAuth } from "../../context/authContext.jsx";
import { Film, Popcorn, Star, Heart, Clock } from "lucide-react";
import MovieCarousel from "../../components/Carousel.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useQuery } from "@tanstack/react-query";
import useLikedMovies from "../../hooks/use-liked-movies.js";
import useRecentlyVisited from "../../hooks/use-recently-visited.js";

import { fetchData } from "../../utils/fetchData";

const fetchMovies = async (endpoint) => {
  const response = await fetchData(
    `${import.meta.env.VITE_BASE_API_URL}api/tmdb/${endpoint}`
  );
  if (response) {
    return response;
  }
  throw new Error(`Failed to fetch ${endpoint}`);
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
  const { recentlyVisited, isLoading: recentlyVisitedLoading } =
    useRecentlyVisited();

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
                scrollId="liked-movies"
                viewAllLink="/liked" // Optional: Create a dedicated page for liked movies later
                likedMovies={likedMovies}
              />
            )}
            {recentlyVisited?.length > 0 && (
              <Movietype
                data={{ results: recentlyVisited }}
                title="Recently Visited"
                icon={<Clock className="h-6 w-6 text-blue-500" />}
                scrollId="recently-visited"
                viewAllLink="/recently-visited"
                likedMovies={likedMovies}
              />
            )}
            {nowPlaying && (
              <Movietype
                data={nowPlaying}
                title="Now Playing"
                type="now_playing"
                icon={<Film className="h-6 w-6" />}
                scrollId="now-playing"
                viewAllLink="/content/now_playing"
                likedMovies={likedMovies}
              />
            )}
            {topRated && (
              <Movietype
                data={topRated}
                title="Top Rated"
                type="top_rated"
                icon={<Star className="h-6 w-6" />}
                scrollId="top-rated"
                viewAllLink="/content/top_rated"
                likedMovies={likedMovies}
              />
            )}
            {popular && (
              <Movietype
                data={popular}
                title="Popular Movies"
                type="popular"
                icon={<Popcorn className="h-6 w-6" />}
                scrollId="popular-movies"
                viewAllLink="/content/popular"
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
