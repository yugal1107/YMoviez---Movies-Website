import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchData } from "../services/fetchData";
import Moviecard from "../components/Moviecard";
import { Link } from "react-router-dom";

const CastMovies = () => {
  const { castid } = useParams();
  const { castname } = useParams();
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      setSearchResults([]);
      const searchResults = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/cast/movie/${castid}`
      );
      console.log("Search Results : ", searchResults);
      setSearchResults(searchResults);
      console.log("Search Results from usestate : ", searchResults);
    } catch (error) {
      console.error("Error occured while fetching search results : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-300">Movies featuring</span>{" "}
            <span className="text-pink-500">{castname}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Found {searchResults.cast?.length || 0} movies
          </p>
        </div>

        {/* Movies Grid */}
        {searchResults.cast?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {searchResults.cast.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="transform hover:scale-105 transition duration-300 ease-in-out"
              >
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No movies found for this actor/actress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastMovies;
