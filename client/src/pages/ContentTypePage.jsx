import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchData";
import Moviecard from "../components/Moviecard";
import Pagination from "../components/Pagination";
import { Loader2, SearchX } from "lucide-react";
import useLikedMovies from "../hooks/use-liked-movies";

const ContentTypePage = () => {
  const { contentType } = useParams();
  const { likedMovies } = useLikedMovies();
  const [page, setPage] = useState(1);

  // Map contentType to TMDB endpoint
  const contentTypeToEndpoint = {
    popular: "movie/popular",
    top_rated: "movie/top_rated",
    trending: "trending/movie/week",
    now_playing: "movie/now_playing",
  };

  const endpoint = contentTypeToEndpoint[contentType];
  const displayTitle = contentType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, isLoading, error } = useQuery({
    queryKey: ["contentTypeMovies", contentType, page],
    queryFn: () =>
      fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/tmdb/${endpoint}?page=${page}`
      ),
    enabled: !!endpoint,
  });

  useEffect(() => {
    setPage(1); // Reset page when contentType changes
  }, [contentType]);

  const handleNextPage = () => {
    if (page < (data?.total_pages || 1)) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error || !endpoint) {
    return (
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Content Not Found</h1>
          <p className="text-gray-400">
            {error ? `Error: ${error.message}` : "The requested content type does not exist."}
          </p>
        </div>
      </div>
    );
  }

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">{displayTitle}</span>
          </h1>
          <p className="text-gray-400">
            {totalPages > 0 ? `Found ${movies.length} movies on page ${page} of ${totalPages}` : "No movies found"}
          </p>
        </div>
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="w-full flex justify-center"
              >
                <div className="w-36 sm:w-full max-w-[160px]">
                  <Moviecard
                    name={movie.title || movie.name}
                    description={movie.overview}
                    rating={movie.vote_average}
                    image_url={movie.poster_path}
                    id={movie.id}
                    likedMovies={likedMovies}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl">
            <SearchX className="h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No movies found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              We couldn't find any movies for "{displayTitle}".
            </p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTypePage;