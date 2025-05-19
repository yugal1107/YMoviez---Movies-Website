import React from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Moviecard from "../components/Moviecard";
import Pagination from "../components/Pagination";
import { FilmIcon } from "@heroicons/react/24/outline";
import { useQuery } from '@tanstack/react-query';
import { fetchData } from "../utils/fetchData";
import useLikedMovies from "../hooks/use-liked-movies";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const GenreMovies = () => {
  const { genreId } = useParams();
  const [page, setPage] = React.useState(1);
  const { likedMovies } = useLikedMovies();

  const genre = genres.find((g) => g.id === parseInt(genreId));
  const genreName = genre ? genre.name : "Unknown";

  const { data: movieData, isLoading, error } = useQuery({
    queryKey: ['genreMovies', genreId, page],
    queryFn: () => fetchData(`${import.meta.env.VITE_BASE_API_URL}api/tmdb/discover/movie?with_genres=${genreId}&page=${page}`),
  });

  React.useEffect(() => {
    setPage(1);
  }, [genreId]);

  const handleNextPage = () => {
    if (page < (movieData?.total_pages || 1)) {
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

  const movies = movieData?.results || [];
  const totalPages = movieData?.total_pages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Exploring</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
              {genreName} Movies
            </span>
          </h1>
          {movies.length > 0 && (
            <p className="text-gray-400">
              Page {page} of {totalPages}
            </p>
          )}
        </div>
        {movies.length > 0 ? (
          <>
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl">
            <FilmIcon className="h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No movies found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              We couldn't find any {genreName} movies at the moment. Try
              exploring another genre or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreMovies;