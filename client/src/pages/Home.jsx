import { React, useState, useEffect } from "react";
import Movietype from "../components/Movietype.jsx";
import { fetchData } from "../services/fetchData.js";
import { useAuth } from "../context/authContext.jsx";
import { Loader2, Film, Popcorn } from "lucide-react";
import MovieCarousel from "../components/Carousel.jsx";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState({});
  const [error, setError] = useState("");
  // const [name, setName] = useState("");
  const { user } = useAuth();

  const getData = async () => {
    try {
      setLoading(true);
      const responseData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/home`
      );
      setMovieData(responseData.movieData);
      // setName(responseData.user.name);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const name = user?.displayName || ""; // Provide a fallback value

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500 dark:text-pink-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 pt-16">
      <div className="container mx-auto">
        {/* Hero Section */}
        {/* <div className="mb-5 md:mb-9 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3 md:mb-5">
            <Film className="h-9 w-9 md:h-12 md:w-12 text-pink-500 dark:text-pink-400" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Yu
              <span className="text-pink-500 dark:text-pink-400 text-3xl md:text-5xl">Stream</span><span className="text-pink-500 text-sm italic font-thin">   -by Yugal Burde</span>
            </h1>
          </div>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300">
            Welcome back,{" "}
            <span className="font-semibold text-pink-500 dark:text-pink-400">
              {name}
            </span>
            ! Discover your next favorite movie.
          </p>
        </div> */}

        {movieData.trending_movies && (
          <MovieCarousel
            movies={movieData.trending_movies.results.slice(0, 5)}
          />
        )}

        {/* Movie Sections */}
        <div className="space-y-12">
          {movieData.trending_movies && (
            <Movietype
              data={movieData.trending_movies}
              title="Trending Now"
              icon={<Popcorn className="h-6 w-6" />}
            />
          )}
          {movieData.hindi_movies && (
            <Movietype
              data={movieData.hindi_movies}
              title="Popular Movies"
              icon={<Film className="h-6 w-6" />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
