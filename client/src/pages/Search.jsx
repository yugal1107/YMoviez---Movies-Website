import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../services/fetchData";
import Moviecard from "../components/Moviecard";
import LoadingSpinner from "../components/LoadingSpinner";

const Search = () => {
  const { query } = useParams();
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const getSearch = async () => {
    try {
      setLoading(true);
      setSearchResults([]);
      const searchResults = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/search/${query}`
      );
      console.log("Search Results : ", searchResults);
      setSearchResults(searchResults.searchData);
    } catch (error) {
      console.error("Error occured while fetching search results : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSearch();
  }, [query]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    // <div className="p-1">
    //   <div className="p-4">
    //     <h1 className="inline text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
    //       Search Results for <span className="text-red-500">{query}</span>
    //     </h1>
    //   </div>

    //   <div className="flex flex-wrap gap-5">
    //     {searchResults.results.map((movie) => {
    //       return (
    //         <Link to={`/movie/${movie.id}`}>
    //           <Moviecard
    //             key={movie.id}
    //             name={movie.title || movie.name}
    //             description={movie.overview}
    //             rating={movie.vote_average}
    //             image_url={movie.poster_path}
    //             id={movie.id}
    //           />
    //         </Link>
    //       );
    //     })}
    //   </div>
    // </div>

    <div className="flex flex-col gap-2 items-center pt-16">
      <div className="p-4">
        <h1 className="inline text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
          Search Results for <span className="text-red-500">{query}</span>
        </h1>
      </div>

      <div className="flex flex-wrap gap-7 justify-center">
        {searchResults.results.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <Moviecard
              key={movie.id}
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

export default Search;
