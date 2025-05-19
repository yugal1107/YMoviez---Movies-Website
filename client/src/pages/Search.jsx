import React from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import Moviecard from "../components/Moviecard";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import { SearchX } from "lucide-react";
import useLikedMovies from "../hooks/use-liked-movies";
import { useQuery } from '@tanstack/react-query';

const Search = () => {
  const { query } = useParams();
  const [page, setPage] = React.useState(1);
  const { likedMovies } = useLikedMovies();

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['searchMovies', query, page],
    queryFn: () => fetchData(`${import.meta.env.VITE_BASE_API_URL}api/tmdb/search/movie?query=${encodeURIComponent(query)}&page=${page}`),
  });

  React.useEffect(() => {
    setPage(1);
  }, [query]);

  const handleNextPage = () => {
    if (page < (searchResults?.total_pages || 1)) {
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8 text-center">
      <p className="text-red-500 text-lg">Error: {error.message}</p>
    </div>
  );

  const results = searchResults?.results || [];
  const totalPages = searchResults?.total_pages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Results for</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
              "{query}"
            </span>
          </h1>
          <p className="text-gray-400">
            {totalPages > 0 ? `Found ${results.length} results on page ${page} of ${totalPages}` : "No results found"}
          </p>
        </div>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mx-auto justify-items-center">
            {results.map((movie) => (
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
              No results found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              We couldn't find any movies that match "{query}". Try searching
              with different keywords or check your spelling.
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

export default Search;