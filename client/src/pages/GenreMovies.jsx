import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchData } from "../services/fetchData";
import Moviecard from "../components/Moviecard";
import { Link } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const genre = genres.find((g) => g.id === parseInt(genreId));
  const genreName = genre ? genre.name : "Unknown";

  const getMoviesByGenre = async () => {
    try {
      setLoading(true);
      setMovies([]);
      const response = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/genres/${genreId}`
      );
      console.log("Movies by Genre: ", response);
      setMovies(response.movies); // Assuming the response has 'results' key for movies array
    } catch (error) {
      console.error("Error occurred while fetching movies by genre: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMoviesByGenre();
  }, [genreId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-2 items-center pt-16">
      <div className="p-4">
        <h1 className="inline text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
          Movies in Genre <span className="text-red-500">{genreName}</span>
        </h1>
      </div>

      <div className="flex flex-wrap gap-7 justify-center">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <Moviecard
              name={movie.title || movie.name}
              description={movie.overview}
              rating={movie.vote_average}
              image_url={movie.poster_path}
              id={movie.id}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenreMovies;
