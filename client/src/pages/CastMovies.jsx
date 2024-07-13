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
      const searchResults = await fetchData(`/api/cast/movie/${castid}`);
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
    <div>
      <div className="p-4">
        <h1 className="inline text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Movies from <span className="text-red-500">{castname}</span>
        </h1>
      </div>

      {console.log("Search Results from render : ", searchResults)}

      <div className="flex flex-wrap gap-5">
        {searchResults.cast.map((movie) => {
          return (
            <Link to={`/movie/${movie.id}`}>
              <Moviecard
                key={movie.id}
                name={movie.original_title || movie.name}
                description={movie.overview}
                rating={movie.vote_average}
                image_url={movie.poster_path}
                id={movie.id}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CastMovies;
